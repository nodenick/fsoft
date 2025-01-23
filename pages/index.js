import { useState } from "react";
import ProgressBar from "../components/processbar";
export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const startProcess = async () => {
    const steps = ["Send OTP", "Verify OTP", "Appointment Time", "Pay Now"];

    setIsProcessing(true);

    for (let i = 0; i < steps.length; i++) {
      // Simulate an API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(i + 1);
    }

    setIsProcessing(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Welcome to Next.js!</h1>
      <p>This is an initial setup.</p>

      <hr style={{ margin: "20px 0" }} />

      <button
        onClick={toggleForm}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {showForm ? "Hide Form" : "Add Form"}
      </button>

      {showForm && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h2>Application Details</h2>
          <form>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="highCommission">Select a High Commission</label>
                <select id="highCommission" style={{ width: "100%", padding: "10px", margin: "10px 0" }}>
                  <option value="">Select</option>
                  <option value="commission1">Commission 1</option>
                  <option value="commission2">Commission 2</option>
                </select>
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="referenceNumber">Enter Reference Number</label>
                <input
                  type="text"
                  id="referenceNumber"
                  placeholder="Reference number"
                  style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="ivacCenter">Select an IVAC Center</label>
                <select id="ivacCenter" style={{ width: "100%", padding: "10px", margin: "10px 0" }}>
                  <option value="">Select</option>
                  <option value="center1">Center 1</option>
                  <option value="center2">Center 2</option>
                </select>
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="repeatReference">Repeat Reference Number</label>
                <input
                  type="text"
                  id="repeatReference"
                  placeholder="Repeat reference number"
                  style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="visaType">Select a Visa Type</label>
                <select id="visaType" style={{ width: "100%", padding: "10px", margin: "10px 0" }}>
                  <option value="">Select</option>
                  <option value="tourist">Tourist Visa</option>
                  <option value="business">Business Visa</option>
                </select>
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="01********"
                  style={{ width: "100%", padding: "10px", margin: "10px 0" }}
                />
              </div>

              <div style={{ flex: "1 1 45%" }}>
                <label htmlFor="paymentType">Select Payment Type</label>
                <select id="paymentType" style={{ width: "100%", padding: "10px", margin: "10px 0" }}>
                  <option value="">Select</option>
                  <option value="bkash">Bkash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      )}

      <ProgressBar currentStep={currentStep} />

      <button
        onClick={startProcess}
        disabled={isProcessing}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: isProcessing ? "#ccc" : "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? "Processing..." : "Start Process"}
      </button>
    </div>
  );
}
