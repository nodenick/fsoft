// components/Header.js
import React, { useState } from "react";
import FormComponent from "./form";

function Header() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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

      <div>
        <button
          onClick={openModal} // Bind the button to open the modal
          style={{
            padding: "10px 15px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px", // Ensure spacing between buttons
          }}
        >
          Add Form
        </button>
        <button
          style={{
            padding: "10px 15px",
            marginRight: "10px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Sign In
        </button>
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Results
        </button>
      </div>
      <FormComponent isOpen={isModalOpen} onClose={closeModal} />
    </header>
  );
}

export default Header;
