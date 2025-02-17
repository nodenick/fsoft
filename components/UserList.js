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
  Select,
  MenuItem,
  Typography,
  IconButton,
  Menu,
  MenuItem as ActionMenuItem,
  CircularProgress,
  Snackbar,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// Import your service methods:
import { getUsers, deleteUserBySL } from "../services/userServices";

// Import process functions from utils/process.js
import {
  sendApInfo,
  sendPerInfo,
  sendOverview,
  sendOtp,
  verifyOtp,
  sendSlotTime,
  sendPayNow,
} from "../utils/process";
import {
  createApInfoPayload,
  createPerInfoPayload,
  createOverviewPayload,
  createSendOtpPayload,
  createVerifyOtpPayload,
  createSlotTimePayload,
  createPayNowPayload,
} from "../services/payloadGenerators";

import { DataContext } from "../context/DataContext";

const UserListComponent = () => {
  const { getData } = useContext(DataContext);

  const [users, setUsers] = useState([]);
  // loadingStates will be an object keyed by user.sl with keys for each process step
  const [loadingStates, setLoadingStates] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Fetch users on component mount
  useEffect(() => {
    const fetchData = async () => {
      const userList = await getUsers();
      console.log(userList);
      setUsers(userList);
    };
    fetchData();
  }, []);

  // Helper: Update loading state for a given user (by sl) and step key
  const updateLoadingState = (sl, key, state) => {
    setLoadingStates((prev) => ({
      ...prev,
      [sl]: {
        ...prev[sl],
        [key]: state,
      },
    }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Delete logic
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

  const handleStartProcess = async () => {
    if (!selectedUser) return;
    const sl = selectedUser.sl;
    try {
      // STEP 1: AP Info
      updateLoadingState(sl, "apinfo", "loading");
      const apPayload = createApInfoPayload(selectedUser);
      await sendApInfo(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/apinfo`,
        apPayload
      );
      updateLoadingState(sl, "apinfo", "success");

      // STEP 2: PER Info
      updateLoadingState(sl, "perinfo", "loading");
      const perPayload = createPerInfoPayload(selectedUser);
      await sendPerInfo(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/personal-info-submit`,
        perPayload
      );
      updateLoadingState(sl, "perinfo", "success");

      // STEP 3: Overview
      updateLoadingState(sl, "overview", "loading");
      const overviewPayload = createOverviewPayload();
      await sendOverview(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/overview-submit`,
        overviewPayload
      );
      updateLoadingState(sl, "overview", "success");

      // STEP 4: Send OTP
      updateLoadingState(sl, "sendotp", "loading");
      const otpPayload = createSendOtpPayload();
      await sendOtp(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/pay-otp-sent`,
        otpPayload
      );
      updateLoadingState(sl, "sendotp", "success");

      // STEP 5: Verify OTP
      updateLoadingState(sl, "verifyotp", "loading");

      // Prompt the user to enter the OTP
      const otp = window.prompt("Please enter the OTP received:");
      if (!otp) {
        throw new Error("OTP not provided");
      }

      const verifyPayload = createVerifyOtpPayload(otp);
      await verifyOtp(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/pay-otp-verify`,
        verifyPayload
      );
      updateLoadingState(sl, "verifyotp", "success");
      // Extract the first slot date from the response
      const appointmentDate =
        verifyOtpResponse?.data?.slot_dates &&
        verifyOtpResponse.data.slot_dates.length > 0
          ? verifyOtpResponse.data.slot_dates[0]
          : "";

      if (!appointmentDate) {
        throw new Error("No appointment date available from OTP verification");
      }

      // STEP 5: Slot Time Step
      updateLoadingState(sl, "slottime", "loading");
      const slotTimePayload = createSlotTimePayload(appointmentDate);
      const slotTimeResponse = await sendSlotTime(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/pay-slot-time`,
        slotTimePayload
      );
      updateLoadingState(sl, "slottime", "success");

      // Extract slot time details
      const slotData = slotTimeResponse.data;
      const slotTimeDetails =
        slotData.slot_times && slotData.slot_times.length > 0
          ? slotData.slot_times[0]
          : null;

      if (slotTimeDetails) {
        // Extract the hour and date from the slot details
        const selectedHour = slotTimeDetails.hour; // e.g., 10
        const selectedDate = slotTimeDetails.date; // e.g., '2025-02-16'

        // Extract the siteKey from the captcha HTML using a regular expression
        const captchaHTML = slotTimeResponse.captcha;
        const siteKeyMatch = captchaHTML.match(/data-sitekey="([^"]+)"/);
        const siteKey = siteKeyMatch ? siteKeyMatch[1] : "";

        // Now store these values for further use (you might save them in state or a context)
        console.log("Selected Hour:", selectedHour);
        console.log("Selected Date:", selectedDate);
        console.log("Site Key:", siteKey);

        // For example, you could update your component state:
        // setSelectedSlot({ hour: selectedHour, date: selectedDate, siteKey });
      } else {
        console.warn("No slot time details available in the response");
      }

      // STEP 6: Pay Now Step
      updateLoadingState(sl, "paynow", "loading");

      // Prompt the user for the hash_param
      const hash_param = window.prompt(
        "Please enter the hash_param for payment:"
      );

      if (!hash_param) {
        throw new Error("Payment hash_param is required.");
      }

      // Assume you have the selected appointment date and time from the previous slot time step:
      const appointment_date = selectedDate; // e.g., '2025-02-16'
      const appointment_time = String(selectedHour); // e.g., '10' (converted to string if necessary)

      const payNowPayload = createPayNowPayload(
        appointment_date,
        appointment_time,
        hash_param
      );
      await sendPayNow(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v2/paynow`,
        payNowPayload
      );
      updateLoadingState(sl, "paynow", "success");
      // ... continue with other steps if any
    } catch (error) {
      console.error("Error in process:", error);
      updateLoadingState(sl, "perinfo", "failed");
      setSnackbar({
        open: true,
        message: "Per Info process encountered an error.",
      });
    } finally {
      handleActionClose();
    }
  };
  // Filter users by search (name or webId)
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      !query ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      (u.webId && u.webId.toLowerCase().includes(query))
    );
  });

  // Helper: Render cell content based on loading state
  const renderCell = (sl, key) => {
    const state = loadingStates[sl]?.[key] || "waiting";
    if (state === "loading") {
      return <CircularProgress size={20} />;
    }
    if (state === "success") {
      return (
        <Box
          sx={{
            backgroundColor: "green",
            color: "white",
            padding: "4px",
            borderRadius: "4px",
            textAlign: "center",
          }}
        >
          success
        </Box>
      );
    }
    return <Box>{state}</Box>;
  };

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
          placeholder="Search by name or webId..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Web ID</TableCell>
              <TableCell>AP Info</TableCell>
              <TableCell>Per Info</TableCell>
              <TableCell>Overview</TableCell>
              <TableCell>Send OTP</TableCell>
              <TableCell>Verify OTP</TableCell>
              <TableCell>Slot Time</TableCell>
              <TableCell>Pay Now</TableCell>
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
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.webId}</TableCell>
                  <TableCell>{renderCell(user.sl, "apinfo")}</TableCell>
                  <TableCell>{renderCell(user.sl, "perinfo")}</TableCell>
                  <TableCell>{renderCell(user.sl, "overview")}</TableCell>
                  <TableCell>{renderCell(user.sl, "sendotp")}</TableCell>
                  <TableCell>{renderCell(user.sl, "verifyotp")}</TableCell>
                  <TableCell>{renderCell(user.sl, "slottime")}</TableCell>
                  <TableCell>{renderCell(user.sl, "paynow")}</TableCell>
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
        <ActionMenuItem onClick={handleStartProcess}>Start</ActionMenuItem>
        {selectedUser && (
          <ActionMenuItem onClick={() => handleDeleteUser(selectedUser.sl)}>
            Delete
          </ActionMenuItem>
        )}
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
