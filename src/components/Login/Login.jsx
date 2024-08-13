import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import avatar from "../../imgs/avatar.svg";
import blob from "../../imgs/blob.svg";
import bg from "../../imgs/bg.svg";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.text(); // Use .text() instead of .json() for text/plain response
        if (data === "success") { // Check if response is "success"
          // Save the token or user data to localStorage or context if needed
          localStorage.setItem('token', 'someToken'); // Example of saving a token
          setIsLoggedIn(true); // Update the login state
          navigate("/main");
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <img className="wave" src={blob} alt="background" />
      <div className="container">
        <div className="img">
          <img src={bg} alt="background" />
        </div>
        <div className="login-content">
          <form onSubmit={handleLogin}>
            <div className="iconpage">
              <img src={avatar} alt="avatar" />
            </div>
            <h3 className="login-title">Login</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-div">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <input type="submit" className="btn" value="Login" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
