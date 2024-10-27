import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./styles/App.css";
import MainDash from "./components/MainDash/MainDash";
import Form from "./components/Form/Form";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login/Login";
import GeneratePDF from "./components/GeneratePDF/GeneratePDF";
import Summary from "./components/Summary/Summary";
import {
  SelectedItemProvider,
  useSelectedItem,
} from "./context/mainContentContext";
import useEnvironmentChecker from "./hooks/useEnvironmentChecker";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEnvironmentChecker();

  useEffect(() => {
    // Check if the user is logged in by verifying the token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/main" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
          <Route
            path="/main"
            element={
              isLoggedIn ? (
                <SelectedItemProvider>
                  <div className="AppGlass">
                    <Sidebar onLogout={handleLogout} />
                    <div className="MainContent">
                      <MainContent />
                    </div>
                  </div>
                </SelectedItemProvider>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

function MainContent() {
  const { selectedSidebarItem } = useSelectedItem();

  switch (selectedSidebarItem) {
    case "Dashboard":
      return <MainDash />;
    case "Form":
      return <Form />;
    case "PDF":
      return <GeneratePDF />;
    case "Summary":
      return <Summary />;
    default:
      return <MainDash />;
  }
}

export default App;
