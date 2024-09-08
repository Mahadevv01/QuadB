import React, { useState, useContext } from "react";
import { FetchedContext } from "../App";
import { useNavigate } from "react-router-dom";
import './Login.styles.css'; // Import the CSS file

const Login = () => {
  const { notify, setAuth } = useContext(FetchedContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://quadbserver-mdzg.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        notify("Login successful!", "success");
        setAuth(true);  // Set authenticated state
        navigate("/dashboard");
      } else {
        notify("Login failed!", "error");
      }
    } catch (error) {
      notify("Error logging in!", "error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
