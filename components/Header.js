// components/Header.js
import React, { useState } from "react";
import FormComponent from "./form";
import LogoutIcon from "@mui/icons-material/Logout";

function Header({ onLogout }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Notify parent or redirect to login page
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload(); // Refresh the page to redirect
    }
  };

  // Shared button styles
  const buttonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 15px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
    gap: "5px", // Space between icon and text
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "24px" }}>IVAC Payment</h1>

      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          onClick={openModal}
          style={{ ...buttonStyles, backgroundColor: "#4CAF50" }} // Add Form button style
        >
          Add Form
        </button>
        <button
          onClick={handleLogout}
          style={{ ...buttonStyles, backgroundColor: "red" }} // Logout button style
        >
          <LogoutIcon /> Logout
        </button>
      </div>
      <FormComponent isOpen={isModalOpen} onClose={closeModal} />
    </header>
  );
}

export default Header;
