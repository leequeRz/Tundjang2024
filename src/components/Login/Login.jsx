import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import avatar from "../../imgs/avatar.svg";
import blob from "../../imgs/blob.svg";
import bg from "../../imgs/bg.svg";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple authentication for demonstration
    if (username === 'admin' && password === 'password') {
      navigate("/main");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
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
            <br />
            <h3 className="c" id="login">Login</h3>
            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <h5>Username</h5>
                <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div className="input-div">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5>Password</h5>
                <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <input type="submit" className="btn" value="Login" />
            <div className="line"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
