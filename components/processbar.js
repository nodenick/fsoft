import { useState } from "react";

export default function ProgressBar({ currentStep }) {
  const steps = ["Send OTP", "Verify OTP", "Appointment Time", "Pay Now"];

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Progress Bar</h2>
      <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: index <= currentStep ? "green" : "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </div>
            <p style={{ marginTop: "5px", fontSize: "14px", textAlign: "center" }}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}