import React, { useState } from "react";
import { login } from "../api";
import "../App.css";

interface Props {
  onLogin: (username: string, password: string, role: string) => void;
}

const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await login(username, password);
      onLogin(username, password, res.role);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="form-input"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" onClick={handleSubmit}>
          Sign In
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default LoginForm;
