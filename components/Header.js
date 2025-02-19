// import React, { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   TextField,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import LogoutIcon from "@mui/icons-material/Logout";
// import FormComponent from "./form";
// import OtpTest from "./otpListen/otpTest";

// function Header({ onLogout }) {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [showUpdateToken, setShowUpdateToken] = useState(false);
//   const [newToken, setNewToken] = useState("");
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const openModal = () => setModalOpen(true);
//   const closeModal = () => setModalOpen(false);

//   const handleLogout = () => {
//     // Clear token from localStorage
//     localStorage.removeItem("token");
//     if (onLogout) onLogout();
//     else window.location.reload();
//   };

//   const toggleUpdateToken = () => {
//     setShowUpdateToken((prev) => !prev);
//   };

//   const handleUpdateToken = () => {
//     // Save the new token in localStorage
//     localStorage.setItem("token", newToken);
//     // If you have a context or global state, update it here as needed.
//     // For example: tokenContext.setToken(newToken);
//     setNewToken("");
//     setShowUpdateToken(false);
//   };

//   return (
//     <>
//       <AppBar
//         position="static"
//         color="info"
//         sx={{
//           boxShadow: 3,
//           pt: { xs: 2, sm: 3 },
//           pb: { xs: 2, sm: 3 },
//           px: { xs: 2, sm: 4 },
//         }}
//       >
//         <Toolbar
//           sx={{
//             flexWrap: "wrap",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: { xs: 2, sm: 2 },
//           }}
//         >
//           <Typography
//             variant={isSmallScreen ? "h6" : "h5"}
//             component="div"
//             sx={{ flexGrow: 1, fontWeight: "bold" }}
//           >
//             IVAC PAYMENT
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               alignItems: "center",
//               gap: { xs: 1, sm: 2 },
//               width: { xs: "100%", sm: "auto" },
//             }}
//           >
//             <OtpTest />
//             <Button
//               variant="contained"
//               color="success"
//               onClick={openModal}
//               sx={{
//                 textTransform: "none",
//                 px: { xs: 2, sm: 3 },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//             >
//               Add Form
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={toggleUpdateToken}
//               sx={{
//                 textTransform: "none",
//                 px: { xs: 2, sm: 3 },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//             >
//               Update Token
//             </Button>
//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleLogout}
//               startIcon={<LogoutIcon />}
//               sx={{
//                 textTransform: "none",
//                 px: { xs: 2, sm: 3 },
//                 width: { xs: "100%", sm: "auto" },
//               }}
//             >
//               Logout
//             </Button>
//           </Box>
//           {/* Conditionally render the update token input field */}
//           {showUpdateToken && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 width: "100%",
//                 mt: { xs: 1, sm: 0 },
//               }}
//             >
//               <TextField
//                 label="New Token"
//                 color="black"
//                 variant="outlined"
//                 size="small"
//                 value={newToken}
//                 onChange={(e) => setNewToken(e.target.value)}
//                 fullWidth
//               />
//               <Button
//                 variant="contained"
//                 color="secondary"
//                 onClick={handleUpdateToken}
//               >
//                 Update
//               </Button>
//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>
//       <FormComponent isOpen={isModalOpen} onClose={closeModal} />
//     </>
//   );
// }

// export default Header;

import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  Paper,
  Stack,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import FormComponent from "./form";
import OtpTest from "./otpListen/otpTest";

function Header({ onLogout }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showUpdateToken, setShowUpdateToken] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [newXsrf, setNewXsrf] = useState("");
  const [newIvacSession, setNewIvacSession] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("xsrf_token");
    localStorage.removeItem("ivac_session");
    if (onLogout) onLogout();
    else window.location.reload();
  };

  const toggleUpdateToken = () => {
    setShowUpdateToken((prev) => !prev);
  };

  const handleUpdateToken = () => {
    // Save the new tokens in localStorage if provided
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    if (newXsrf) {
      localStorage.setItem("xsrf_token", newXsrf);
    }
    if (newIvacSession) {
      localStorage.setItem("ivac_session", newIvacSession);
    }
    // Reset input fields and hide update area
    setNewToken("");
    setNewXsrf("");
    setNewIvacSession("");
    setShowUpdateToken(false);
    // Show success snackbar
    setSnackbar({
      open: true,
      message: "Tokens updated successfully",
      severity: "success",
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ boxShadow: 3, pt: 2 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            sx={{ fontWeight: "bold" }}
          >
            IVAC PAYMENT
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <OtpTest />
            <Button variant="contained" color="success" onClick={openModal}>
              Add Form
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleUpdateToken}
            >
              Update Tokens
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
        {showUpdateToken && (
          <Paper elevation={3} sx={{ mx: 2, my: 1, p: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="New API Token"
                variant="outlined"
                size="small"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                fullWidth
              />
              <TextField
                label="New XSRF Token"
                variant="outlined"
                size="small"
                value={newXsrf}
                onChange={(e) => setNewXsrf(e.target.value)}
                fullWidth
              />
              <TextField
                label="New ivac_session Token"
                variant="outlined"
                size="small"
                value={newIvacSession}
                onChange={(e) => setNewIvacSession(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateToken}
              >
                Update
              </Button>
            </Stack>
          </Paper>
        )}
      </AppBar>
      <FormComponent isOpen={isModalOpen} onClose={closeModal} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Header;
