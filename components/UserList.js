// components/UserListComponent.js
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Menu,
  MenuItem as ActionMenuItem,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Import your new service methods:
import { getUsers, deleteUserBySL } from "../services/userServices";

// Import the OTP/payment helpers from utils/process.js
import {
  sendOtp,
  verifyOtp,
  getAppointmentTime,
  updateHashParam,
  payInvoice,
} from "../utils/process";
import {
  createSendOtpPayload,
  createVerifyOtpPayload,
  createGetAppointmentTimePayload,
  createPayInvoicePayload,
} from "../services/payloadGenerators";
// If you have a context that you use for other data:
import { DataContext } from "../context/DataContext";

const UserListComponent = () => {
  // If you do need context:
  const { getData } = useContext(DataContext); // If not used, you can remove it.

  const [users, setUsers] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeAbortController, setActiveAbortController] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Fetch all users on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userList = await getUsers();
      console.log(userList);
      setUsers(userList);
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Separated delete logic into a dedicated service method
  const handleDeleteUser = async (sl) => {
    try {
      await deleteUserBySL(sl);
      setUsers((prev) => prev.filter((user) => user.sl !== sl));
      setSnackbar({
        open: true,
        message: `User with SL ${sl} successfully deleted.`,
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete user. Please try again.",
      });
    } finally {
      handleActionClose();
    }
  };

  // Menu handlers
  const handleActionClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // Helper to update nested loading states
  const updateLoadingState = (sl, key, state) => {
    setLoadingStates((prev) => ({
      ...prev,
      [sl]: {
        ...prev[sl],
        [key]: state,
      },
    }));
  };

  // NEW: Handler to stop an ongoing "start" process.
  const handleStopAction = () => {
    if (activeAbortController) {
      activeAbortController.abort(); // Abort the sendOtp request (and any dependent async actions)
      // Optionally update a loading state to indicate it was stopped.
      if (selectedUser) {
        updateLoadingState(selectedUser.sl, "otp", "stopped");
      }
      setActiveAbortController(null);
    }
    handleActionClose();
  };
  // Single method that covers the entire "Start" action flow

  // Single method that covers the entire "Start" action flow
  const handleActionSelect = async (action) => {
    if (!selectedUser) return;
    const sl = selectedUser.sl;

    if (action === "start") {
      try {
        // Create and store an AbortController so that we can cancel sendOtp if WebSocket receives OTP first.
        const abortController = new AbortController();
        setActiveAbortController(abortController);

        updateLoadingState(sl, "otp", "loading");

        // 1. Start sendOtp – it may trigger the OTP to be sent, but we don't wait on it directly.
        sendOtp(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/send-otp`,
          createSendOtpPayload(selectedUser),
          abortController
        ).catch((err) => {
          // It’s expected that this request may be aborted.
          console.warn("sendOtp aborted or failed:", err);
        });

        // 2. Setup the WebSocket to listen for the OTP.
        const otpPromise = new Promise((resolve, reject) => {
          const socket = new WebSocket(
            // You can switch between production and local endpoints as needed.
            `ws://127.0.0.1:8000/ws/otp/${selectedUser.phone}`
          );

          socket.onopen = () => console.log("WebSocket connected");
          socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.phone_number === selectedUser.phone && data.otp) {
                console.log("✅ OTP Received via WebSocket:", data.otp);
                resolve(data.otp);
                socket.close();
                // Once OTP is received, cancel the sendOtp request (if it’s still pending)
                abortController.abort();
              }
            } catch (err) {
              reject("❌ Failed to parse OTP via WebSocket");
            }
          };
          socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            reject(err);
          };
        });

        // 3. Wait for the OTP from the WebSocket.
        const otp = await otpPromise;
        updateLoadingState(sl, "otp", "success");

        // 4. Verify OTP
        updateLoadingState(sl, "verify", "loading");

        if (!otp) {
          alert("Process stopped.");
          updateLoadingState(sl, "verify", "failed");
          return;
        }

        const verifyPayload = createVerifyOtpPayload(selectedUser, otp);
        const verifyResponse = await verifyOtp(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/verify-otp`,
          verifyPayload
        );
        updateLoadingState(sl, "verify", "success");

        // 5. Generate Slot Time
        updateLoadingState(sl, "date", "loading");
        const { slotDates } = verifyResponse;
        if (!slotDates?.length) {
          updateLoadingState(sl, "date", "No slots");
          return;
        }
        const specificDate = slotDates[0];
        const slotDetails = await getAppointmentTime(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aptime`,
          createGetAppointmentTimePayload(selectedUser, otp, specificDate)
        );
        updateLoadingState(
          sl,
          "date",
          slotDetails.slotTimes?.[0]?.time_display || "No slots"
        );

        // 6. Payment Step (With Retry)
        let paymentSuccess = false;
        let hashParam;

        while (!paymentSuccess) {
          hashParam = prompt("Enter the hash_param for payment:");
          if (!hashParam) {
            alert("Hash_param is required to proceed.");
            return;
          }

          updateLoadingState(sl, "paymentLink", "loading");
          const chosenSlot = slotDetails.slotTimes[0] || {};
          const paymentResponse = await payInvoice(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/paynow`,
            createPayInvoicePayload(selectedUser, otp, chosenSlot, hashParam)
          );

          if (paymentResponse?.url) {
            updateLoadingState(sl, "paymentLink", paymentResponse.url);
            paymentSuccess = true;
          } else {
            alert("Payment failed. Please enter the hash_param again.");
          }
        }

        // Process complete: clear the active abort controller and close the menu.
        setActiveAbortController(null);
        handleActionClose();
      } catch (error) {
        console.error("❌ Error handling start action:", error);
        updateLoadingState(sl, "otp", "failed");
        setActiveAbortController(null);
        handleActionClose();
      }
      // Note: Do NOT call handleActionClose() automatically in a finally block here,
      // so that the Stop button remains available while the process is running.
    }
  };

  // Filter users by search
  // Updated filter: check top-level name or nested info array
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true; // if no search query, include all
    // Check if user has a top-level name that matches
    if (u.name && u.name.toLowerCase().includes(query)) {
      return true;
    }
    // If not, and if user has nested info, check each info item
    if (u.info && Array.isArray(u.info)) {
      return u.info.some((infoItem) =>
        infoItem.name.toLowerCase().includes(query)
      );
    }
    return false;
  });

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Top Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <TextField
          placeholder="Search by name..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
        {/* <Box sx={{ display: "flex", gap: "10px" }}>
          <Select
            value={status}
            onChange={handleStatusChange}
            displayEmpty
            size="small"
            sx={{ width: "150px" }}
          >
            <MenuItem value="">Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
          <Button variant="contained" color="success">
            Add New
          </Button>
        </Box> */}
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Web ID</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Visa Type</TableCell>
              <TableCell>OTP</TableCell>
              <TableCell>Verify</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Payment Link</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.sl}>
                  <TableCell>{user.sl}</TableCell>
                  <TableCell>
                    {user.info &&
                    Array.isArray(user.info) &&
                    user.info.length > 0 ? (
                      user.info.map((infoItem, idx) => (
                        <div key={idx} style={{ marginBottom: "4px" }}>
                          {infoItem.name}
                        </div>
                      ))
                    ) : (
                      <div>{user.name}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.info &&
                    Array.isArray(user.info) &&
                    user.info.length > 0 ? (
                      user.info.map((infoItem, idx) => (
                        <div key={idx} style={{ marginBottom: "4px" }}>
                          {infoItem.web_id}
                        </div>
                      ))
                    ) : (
                      <div>{user.web_id}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.info &&
                    Array.isArray(user.info) &&
                    user.info.length > 0
                      ? user.info[0].phone
                      : user.phone}
                  </TableCell>
                  <TableCell>
                    {user.info &&
                    Array.isArray(user.info) &&
                    user.info.length > 0
                      ? user.info[0].visa_type?.type_name
                      : user.visa_type?.type_name}
                  </TableCell>

                  <TableCell>
                    {loadingStates[user.sl]?.otp === "loading" ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box
                        sx={{
                          backgroundColor:
                            loadingStates[user.sl]?.otp === "success"
                              ? "green"
                              : "transparent",
                          color:
                            loadingStates[user.sl]?.otp === "success"
                              ? "white"
                              : "inherit",
                          padding: "4px",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        {loadingStates[user.sl]?.otp || "waiting"}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingStates[user.sl]?.verify === "loading" ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box
                        sx={{
                          backgroundColor:
                            loadingStates[user.sl]?.verify === "success"
                              ? "green"
                              : "transparent",
                          color:
                            loadingStates[user.sl]?.verify === "success"
                              ? "white"
                              : "inherit",
                          padding: "4px",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        {loadingStates[user.sl]?.verify || "waiting"}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingStates[user.sl]?.date === "loading" ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box
                        sx={{
                          backgroundColor:
                            loadingStates[user.sl]?.date === "success"
                              ? "green"
                              : "transparent",
                          color:
                            loadingStates[user.sl]?.date === "success"
                              ? "white"
                              : "inherit",
                          padding: "4px",
                          borderRadius: "4px",
                          textAlign: "center",
                        }}
                      >
                        {loadingStates[user.sl]?.date || "waiting"}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingStates[user.sl]?.paymentLink === "loading" ? (
                      <CircularProgress size={20} />
                    ) : typeof loadingStates[user.sl]?.paymentLink ===
                      "string" ? (
                      <a
                        href={loadingStates[user.sl]?.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Payment Link
                      </a>
                    ) : loadingStates[user.sl]?.paymentLink?.url ? (
                      <a
                        href={loadingStates[user.sl]?.paymentLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "blue",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Payment Link
                      </a>
                    ) : (
                      "waiting"
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleActionClick(e, user)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
      >
        <ActionMenuItem onClick={() => handleActionSelect("start")}>
          Start
        </ActionMenuItem>
        {selectedUser && (
          <ActionMenuItem onClick={() => handleDeleteUser(selectedUser.sl)}>
            Delete
          </ActionMenuItem>
        )}
        {/* NEW: Stop button to cancel the ongoing start process */}
        <ActionMenuItem onClick={handleStopAction}>Stop</ActionMenuItem>
      </Menu>

      {/* Footer Pagination / Rows-per-page */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Typography variant="body2">Total {users.length} users</Typography>
        <Box>
          <Typography
            variant="body2"
            component="span"
            sx={{ marginRight: "10px" }}
          >
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(e.target.value)}
            size="small"
            sx={{ width: "80px" }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default UserListComponent;
