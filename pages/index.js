// pages/index.js
import { useContext } from "react";
import Header from "../components/Header";
import FormComponent from "../components/form";
import ProcessController from "../components/ProcessController";
import { ApiResponseDisplay } from "../components/ApiResponseDisplay";
import { DataContext } from "../context/DataContext";
import UserListComponent from "../components/UserList";
export default function Home() {
  const { response, error, startProcess } = ProcessController();
  const { getData } = useContext(DataContext);
  const sendotpData = getData("sendotp");

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={{ padding: "20px" }}>
        {/* <FormComponent />
        <button
          onClick={startProcess}
          style={{
            padding: "10px 20px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Start Automated Process
        </button> */}

        <UserListComponent />

        <ApiResponseDisplay response={response} error={error} />
      </div>
    </div>
  );
}
