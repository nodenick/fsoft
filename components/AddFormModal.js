// components/AddFormModal.js
import React, { useState } from "react";

function AddFormModal() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <button
        onClick={openModal}
        style={{
          padding: "10px 15px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Form
      </button>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2>Add Form Data</h2>
            <input
              type="text"
              placeholder="Enter some data..."
              style={{ margin: "10px 0", padding: "10px" }}
            />
            <button
              onClick={closeModal}
              style={{
                padding: "10px 15px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddFormModal;
