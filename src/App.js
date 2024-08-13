import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import MainDash from './components/MainDash/MainDash';
import Form from './components/Form/Form';
import Sidebar from './components/Sidebar';
import Login from './components/Login/Login';

function App() {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState('Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the token in localStorage
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/main" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/main"
            element={
              isLoggedIn ? (
                <div className="AppGlass">
                  <Sidebar setSelectedSidebarItem={setSelectedSidebarItem} onLogout={handleLogout} />
                  <div className="MainContent">
                    {selectedSidebarItem === 'Dashboard' ? <MainDash /> : <Form />}
                  </div>
                </div>
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

export default App;
