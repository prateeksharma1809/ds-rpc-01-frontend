import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import ChatBox from "./components/ChatBox";
import AdminPage from "./components/AdminPage";
import "./App.css";

const App: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogout = () => {
    setUsername("");
    setPassword("");
    setRole("");
  };

  if (!username || !password) {
    return <LoginForm onLogin={(u, p, r) => {
      setUsername(u); setPassword(p); setRole(r);
    }} />;
  }

  // Show admin page for c-level users, chat for others
  if (role === "admin") {
    return <AdminPage username={username} password={password} role={role} onLogout={handleLogout} />;
  }

  return <ChatBox username={username} password={password} role={role} onLogout={handleLogout} />;
};

export default App;
