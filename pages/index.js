// pages/index.js
import { useContext, useState, useEffect } from "react";
import Header from "../components/Header";
import UserListComponent from "../components/UserList";
import LoginForm from "../components/LoginForm";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false

  useEffect(() => {
    // Check token presence in localStorage on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); // Set state based on token presence
    }
  }, []); // Run only once when the component is mounted

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    setIsLoggedIn(false); // Update state to show the login page
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Header onLogout={handleLogout} />
          <UserListComponent />
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
}

// return (
//   <div style={{ fontFamily: "Arial, sans-serif" }}>
//     <Header />
//     <div style={{ padding: "20px" }}>
//       {/* <FormComponent />
//       <button
//         onClick={startProcess}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "purple",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Start Automated Process
//       </button> */}

//       <UserListComponent />

//       <ApiResponseDisplay response={response} error={error} />
//     </div>
//   </div>
// );
// }
