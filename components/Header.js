import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    else window.location.reload();
  };

  const toggleUpdateToken = () => {
    setShowUpdateToken((prev) => !prev);
  };

  const handleUpdateToken = () => {
    // Save the new token in localStorage
    localStorage.setItem("token", newToken);
    // If you have a context or global state, update it here as needed.
    // For example: tokenContext.setToken(newToken);
    setNewToken("");
    setShowUpdateToken(false);
  };

  return (
    <>
      <AppBar
        position="static"
        color="info"
        sx={{
          boxShadow: 3,
          pt: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 4 },
        }}
      >
        <Toolbar
          sx={{
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 2, sm: 2 },
          }}
        >
          <Typography
            variant={isSmallScreen ? "h6" : "h5"}
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            IVAC PAYMENT
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <OtpTest />
            <Button
              variant="contained"
              color="success"
              onClick={openModal}
              sx={{
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Add Form
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleUpdateToken}
              sx={{
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Update Token
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Logout
            </Button>
          </Box>
          {/* Conditionally render the update token input field */}
          {showUpdateToken && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
                mt: { xs: 1, sm: 0 },
              }}
            >
              <TextField
                label="New Token"
                color="black"
                variant="outlined"
                size="small"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateToken}
              >
                Update
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <FormComponent isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Header;
