import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import FormComponent from "./form";
import OtpTest from "./otpListen/otpTest";

function Header({ onLogout }) {
  const [isModalOpen, setModalOpen] = useState(false);
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
            {/* Optionally adjust the OtpTest component for responsiveness */}
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
        </Toolbar>
      </AppBar>
      <FormComponent isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Header;
