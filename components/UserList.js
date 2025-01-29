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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DataContext } from "../context/DataContext";
import {
  sendOtp,
  getOtp,
  verifyOtp,
  getAppointmentTime,
  updateHashParam,
  payInvoice,
} from "../utils/process";

const UserListComponent = () => {
  const { getData } = useContext(DataContext);
  const [users, setUsers] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/list-forms`;

  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json(); // Parse the JSON response
        console.log("API Response:", data); // Log the entire response to debug

        if (data && Array.isArray(data.data)) {
          setUsers(data.data); // Expecting `data.data` to be an array of users
        } else {
          console.error("Invalid data format received from the API:", data);
        }
      } catch (error) {
        console.error("Error fetching data from the database:", error);
      }
    };

    fetchDataFromDB();
  }, []); // Run once on component mount

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const handleDeleteUser = async (sl) => {
    const deleteUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/delete-form/${sl}`;
    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove the deleted user from the users list in the state
        setUsers((prevUsers) => prevUsers.filter((user) => user.sl !== sl));
        alert(`User with SL ${sl} successfully deleted.`);
      } else {
        const error = await response.json();
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error during delete request:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      handleActionClose(); // Close the action menu
    }
  };

  const handleActionClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const updateLoadingState = (sl, key, state) => {
    setLoadingStates((prev) => ({
      ...prev,
      [sl]: {
        ...prev[sl],
        [key]: state,
      },
    }));
  };

  const handleActionSelect = async (action) => {
    const sl = selectedUser.sl;
    if (action === "start" && selectedUser) {
      try {
        const sendOtpUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/send-otp`;
        const getOtpUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/get-otp`;
        const verifyOtpUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/verify-otp`;
        const getAptimeUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/aptime`;
        const updateHashUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/update-token`;
        const payInvoiceUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/paynow`;

        // Step 1: Send OTP
        const sendOtpPayload = {
          action: "sendOtp",
          resend: 0,
          info: [
            {
              web_id: selectedUser.web_id,
              web_id_repeat: selectedUser.web_id,
              passport: selectedUser.passport || "",
              name: selectedUser.name,
              phone: selectedUser.phone,
              email: selectedUser.email,
              amount: selectedUser.amount || "800.00",
              captcha: selectedUser.captcha || "",
              center: {
                id: selectedUser.center?.id,
                c_name: selectedUser.center?.c_name,
                prefix: selectedUser.center?.prefix,
                is_delete: selectedUser.center?.is_delete || 0,
              },
              is_open: selectedUser.is_open,
              ivac: {
                id: selectedUser.ivac?.id,
                center_info_id: selectedUser.ivac?.center_info_id,
                ivac_name: selectedUser.ivac?.ivac_name,
                address: selectedUser.ivac?.address,
                prefix: selectedUser.ivac?.prefix,
                charge: selectedUser.ivac?.charge,
                new_visa_fee: selectedUser.ivac?.new_visa_fee,
              },
              visa_type: {
                id: selectedUser.visa_type?.id,
                type_name: selectedUser.visa_type?.type_name,
                is_active: selectedUser.visa_type?.is_active,
              },
              confirm_tos: selectedUser.confirm_tos || true,
            },
          ],
        };
        updateLoadingState(sl, "otp", "loading");
        await sendOtp(sendOtpUrl, sendOtpPayload);
        updateLoadingState(sl, "otp", "success");

        // Step 2: Get OTP
        updateLoadingState(sl, "verify", "loading");
        const otp = await getOtp(getOtpUrl);

        // Step 3: Verify OTP
        const verifyOtpPayload = {
          action: "verifyOtp", // "string" - your backend expects this literal
          otp: otp.toString(), // the OTP you received from getOtp()
          info: [
            {
              web_id: selectedUser.web_id?.toString() || "",
              web_id_repeat: selectedUser.web_id?.toString() || "",
              passport: selectedUser.passport || "",
              name: selectedUser.name || "",
              phone: selectedUser.phone || "",
              email: selectedUser.email || "",
              amount: (selectedUser.amount || "800.00").toString(),
              captcha: "",
              center: {
                id: selectedUser.center?.id || 0,
                c_name: selectedUser.center?.c_name || "",
                prefix: selectedUser.center?.prefix || "",
                is_delete: selectedUser.center?.is_delete || 0,
                created_by: "",
                created_at: "",
                updated_at: "",
              },
              is_open: selectedUser.is_open?.toString() || "1",
              ivac: {
                id: selectedUser.ivac?.id || 0,
                center_info_id: selectedUser.ivac?.center_info_id || 0,
                ivac_name: selectedUser.ivac?.ivac_name || "",
                address: selectedUser.ivac?.address || "",
                prefix: selectedUser.ivac?.prefix || "",
                ceated_on: "", // your JSON has a minor typo "ceated_on", so we keep it
                visa_fee: (selectedUser.ivac?.visa_fee || "800.00").toString(),
                is_delete: selectedUser.ivac?.is_delete || 0,
                created_at: "",
                updated_at: "",
                app_key: "",
                contact_number: "",
                created_by: "",
                charge: selectedUser.ivac?.charge || 3,
                new_visa_fee: (
                  selectedUser.ivac?.new_visa_fee || "800.00"
                ).toString(),
                old_visa_fee: (
                  selectedUser.ivac?.old_visa_fee || "800.00"
                ).toString(),
                new_fees_applied_from: "",
                notify_fees_from: "",
                max_notification_count: 0,
                allow_old_amount_until_new_date: 0,
                notification_text_beside_amount: "",
                notification_text_popup: "",
              },
              amountChangeData: {
                allow_old_amount_until_new_date: 0,
                max_notification_count: 0,
                old_visa_fees: "string",
                new_fees_applied_from: "string",
                notice: "string",
                notice_short: "",
                notice_popup: "",
                new_visa_fee: "string",
              },
              visa_type: {
                id: selectedUser.visa_type?.id || 0,
                type_name: selectedUser.visa_type?.type_name || "",
                order: 0,
                is_active: 0,
                $$hashKey: "",
              },
              confirm_tos: "true", // or "string"
              otp: otp.toString(),
            },
          ],
        };

        const { slotDates } = await verifyOtp(verifyOtpUrl, verifyOtpPayload);
        updateLoadingState(sl, "verify", "success");
        // Step 4: Generate Slot Time
        updateLoadingState(sl, "date", "loading");
        let slotDetails = null;

        if (slotDates && slotDates.length > 0) {
          const specificDate = slotDates[0]; // Use the first date from slotDates
          const getAppointmentTimePayload = {
            action: "generateSlotTime",
            amount: (selectedUser.amount || "800.00").toString(),
            ivac_id: selectedUser.ivac?.id || 0,
            visa_type: selectedUser.visa_type?.id || 0,
            specific_date: specificDate || "",
            info: [
              {
                web_id: selectedUser.web_id?.toString() || "",
                web_id_repeat: selectedUser.web_id?.toString() || "",
                passport: selectedUser.passport || "",
                name: selectedUser.name || "",
                phone: selectedUser.phone || "",
                email: selectedUser.email || "",
                amount: (selectedUser.amount || "800.00").toString(),
                captcha: "",
                center: {
                  id: selectedUser.center?.id || 0,
                  c_name: selectedUser.center?.c_name || "",
                  prefix: selectedUser.center?.prefix || "",
                  is_delete: selectedUser.center?.is_delete || 0,
                  created_by: "",
                  created_at: "",
                  updated_at: "",
                },
                is_open: selectedUser.is_open?.toString() || "1",
                ivac: {
                  id: selectedUser.ivac?.id || 0,
                  center_info_id: selectedUser.ivac?.center_info_id || 0,
                  ivac_name: selectedUser.ivac?.ivac_name || "",
                  address: selectedUser.ivac?.address || "",
                  prefix: selectedUser.ivac?.prefix || "",
                  created_on: "",
                  visa_fee: (
                    selectedUser.ivac?.visa_fee || "800.00"
                  ).toString(),
                  charge: selectedUser.ivac?.charge || 3,
                  new_visa_fee: (
                    selectedUser.ivac?.new_visa_fee || "800.00"
                  ).toString(),
                  old_visa_fee: (
                    selectedUser.ivac?.old_visa_fee || ""
                  ).toString(),
                  is_delete: selectedUser.ivac?.is_delete || 0,
                  created_at: "",
                  updated_at: "",
                  app_key: "",
                  contact_number: "",
                  created_by: "",
                  new_fees_applied_from: "",
                  notify_fees_from: "",
                  max_notification_count: 0,
                  allow_old_amount_until_new_date: 0,
                  notification_text_beside_amount: "",
                  notification_text_popup: "",
                },
                amountChangeData: {
                  allow_old_amount_until_new_date: 0, // Default value
                  max_notification_count: 0, // Default value
                  old_visa_fees: (
                    selectedUser.ivac?.old_visa_fee || "800.00"
                  ).toString(),
                  new_fees_applied_from: "", // Default or dynamic value
                  notice: "false", // Provide a default or actual value
                  notice_short: "", // Provide a default or actual value
                  notice_popup: "", // Provide a default or actual value
                  new_visa_fee: (
                    selectedUser.ivac?.new_visa_fee || "800.00"
                  ).toString(),
                },
                visa_type: {
                  id: selectedUser.visa_type?.id || 0,
                  type_name: selectedUser.visa_type?.type_name || "",
                  is_active: 0,
                  order: 0,
                  $$hashKey: "",
                },
                confirm_tos: "true",
                otp: otp.toString(),
                appointment_time: specificDate.toString(), // Use the specific date
              },
            ],
          };

          try {
            // Make API call to get appointment time
            slotDetails = await getAppointmentTime(
              getAptimeUrl,
              getAppointmentTimePayload
            );

            console.log("Appointment slot details:", slotDetails);

            // Update the loading state with the first available slot time
            updateLoadingState(
              sl,
              "date",
              slotDetails?.slotTimes?.[0]?.time_display || "No slots"
            );
          } catch (error) {
            console.error("Error fetching appointment slot details:", error);
            updateLoadingState(sl, "date", "Error");
          }
        } else {
          console.error("No slot dates available for appointment.");
          updateLoadingState(sl, "date", "No slots");
          return;
        }

        // Step 5: Show Popup for hash_param
        const hashParam = prompt("Enter the hash_param for payment:");
        if (!hashParam) {
          alert("Hash_param is required to proceed.");
          return;
        }

        // Step 6: Update Backend with hash_param
        const updateHashPayload = {
          key: "hash_params",
          value: hashParam.toString(),
        };
        await updateHashParam(updateHashUrl, updateHashPayload);

        // Step 7: Proceed with Payment
        updateLoadingState(sl, "paymentLink", "loading");
        // Suppose we choose the first slot object from the aptime response
        const chosenSlot = slotDetails.slotTimes[0] || {};

        // Build a "selected_slot" object that matches your schema:
        const selectedSlotPayload = {
          id: chosenSlot.slot_id || 0,
          ivac_id: selectedUser.ivac?.id || 0,
          visa_type: selectedUser.visa_type?.id || 0,
          hour: 10, // or parse from chosenSlot.time if it’s numeric
          date: chosenSlot.date || "",
          availableSlot: 1, // example: or from your slot data
          time_display: chosenSlot.time_display || "",
        };

        // Build final paynow request:
        const payPayload = {
          action: "paynow", // or "payInvoice"
          info: [
            {
              web_id: selectedUser.web_id?.toString() || "",
              web_id_repeat: selectedUser.web_id?.toString() || "",
              passport: selectedUser.passport || "",
              name: selectedUser.name || "",
              phone: selectedUser.phone || "",
              email: selectedUser.email || "",
              amount: (selectedUser.amount || "800.00").toString(),
              captcha: "",
              center: {
                id: selectedUser.center?.id || 0,
                c_name: selectedUser.center?.c_name || "",
                prefix: selectedUser.center?.prefix || "",
                is_delete: 0,
                created_by: "",
                created_at: "",
                updated_at: "",
              },
              is_open: selectedUser.is_open?.toString() || "1",
              ivac: {
                id: selectedUser.ivac?.id || 0,
                center_info_id: 0,
                ivac_name: selectedUser.ivac?.ivac_name || "",
                address: selectedUser.ivac?.address || "",
                prefix: selectedUser.ivac?.prefix || "",
                created_on: "",
                visa_fee: (selectedUser.ivac?.visa_fee || "800.00").toString(),
                charge: selectedUser.ivac?.charge || 3,
                new_visa_fee: (
                  selectedUser.ivac?.new_visa_fee || "800.00"
                ).toString(),
                old_visa_fee: (
                  selectedUser.ivac?.old_visa_fee || ""
                ).toString(),
                is_delete: 0,
                created_at: "",
                updated_at: "",
                app_key: "",
                contact_number: "",
                created_by: "",
                new_fees_applied_from: "",
                notify_fees_from: "",
                max_notification_count: 0,
                allow_old_amount_until_new_date: 0,
                notification_text_beside_amount: "",
                notification_text_popup: "",
              },
              amountChangeData: {
                new_visa_fee: "800.00",
              },
              visa_type: {
                id: selectedUser.visa_type?.id || 0,
                type_name: selectedUser.visa_type?.type_name || "",
                is_active: 0,
                order: 0,
                $$hashKey: "",
              },
              confirm_tos: "true",
              otp: otp.toString(),
              appointment_time: chosenSlot.date || "",
            },
          ],
          selected_payment: {
            name: "Bkash",
            slug: "bkash",
            grand_total: 824, // or your actual total
            link: "https://securepay.sslcommerz.com/gwprocess/v4/image/gw1/bkash.png",
          },
          selected_slot: selectedSlotPayload,
        };

        const paymentResponse = await payInvoice(payInvoiceUrl, payPayload);
        updateLoadingState(
          sl,
          "paymentLink",
          paymentResponse?.link || "Payment failed"
        );
        if (paymentResponse) {
          console.log("Payment successful:", paymentResponse);
          alert("Payment successful! Check your email for details.");
        }
      } catch (error) {
        console.error("Error handling action:", error);
        updateLoadingState(sl, "otp", "failed");
      } finally {
        handleActionClose(); // Close the action menu
      }
    }
  };

  return (
    <Box sx={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
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
        <Box sx={{ display: "flex", gap: "10px" }}>
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
        </Box>
      </Box>

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
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const loadingState = loadingStates[user.sl] || {};
                return (
                  <TableRow key={user.sl}>
                    <TableCell>{user.sl}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.web_id}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.visa_type.type_name}</TableCell>
                    <TableCell>
                      {loadingState.otp === "loading" ? (
                        <CircularProgress size={20} />
                      ) : (
                        loadingState.otp || "waiting"
                      )}
                    </TableCell>
                    <TableCell>
                      {loadingState.verify === "loading" ? (
                        <CircularProgress size={20} />
                      ) : (
                        loadingState.verify || "waiting"
                      )}
                    </TableCell>
                    <TableCell>
                      {loadingState.date === "loading" ? (
                        <CircularProgress size={20} />
                      ) : (
                        loadingState.date || "waiting"
                      )}
                    </TableCell>
                    <TableCell>
                      {loadingState.paymentLink === "loading" ? (
                        <CircularProgress size={20} />
                      ) : loadingState.paymentLink &&
                        loadingState.paymentLink.url ? (
                        <a
                          href={loadingState.paymentLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {loadingState.paymentLink.url}
                        </a>
                      ) : (
                        "waiting"
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleActionClick(event, user)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleActionClose}
                      >
                        <ActionMenuItem
                          onClick={() => console.log("View clicked")}
                        >
                          View
                        </ActionMenuItem>
                        <ActionMenuItem
                          onClick={() => handleActionSelect("start")}
                        >
                          Start
                        </ActionMenuItem>
                        <ActionMenuItem
                          onClick={() => handleDeleteUser(selectedUser.sl)}
                        >
                          Delete
                        </ActionMenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
};

export default UserListComponent;
