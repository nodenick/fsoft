import { useEffect } from "react";
import { DataProvider } from "../context/DataContext";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </AuthProvider>
  );
}
