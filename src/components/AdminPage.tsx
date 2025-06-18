import React, { useState, useEffect } from "react";
import { listUsers, createUser, deleteUser } from "../api";
import type { User, UserCreate } from "../api";
import {
  initializeVectorStore,
  indexAllDocuments,
  getIndexingStats,
  clearVectorStore,
  reindexAllDocuments,
} from "../api";

interface Props {
  username: string;
  password: string;
  role: string;
  onLogout: () => void;
}

const AdminPage: React.FC<Props> = ({ username, password, role, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Create user form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState<UserCreate>({
    username: "",
    password: "",
    role: "user"
  });

  // Index management state
  const [indexLoading, setIndexLoading] = useState<string | null>(null); // which action is loading
  const [indexError, setIndexError] = useState("");
  const [indexSuccess, setIndexSuccess] = useState("");
  const [indexStats, setIndexStats] = useState<any>(null);
  const [batchSize, setBatchSize] = useState(50);
  const [reindexBatchSize, setReindexBatchSize] = useState(50);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const userList = await listUsers(username, password);
      setUsers(userList);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await createUser(username, password, newUser);
      setSuccess(`User "${newUser.username}" created successfully!`);
      setNewUser({ username: "", password: "", role: "user" });
      setShowCreateForm(false);
      loadUsers(); // Reload the user list
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (targetUsername: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${targetUsername}"?`)) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await deleteUser(username, password, targetUsername);
      setSuccess(`User "${targetUsername}" deleted successfully!`);
      loadUsers(); // Reload the user list
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // Index management handlers
  const handleInitializeVectorStore = async () => {
    setIndexLoading("init"); setIndexError(""); setIndexSuccess("");
    try {
      const res = await initializeVectorStore(username, password);
      setIndexSuccess(res.message || "Vector store initialized successfully");
    } catch (err: any) {
      setIndexError(err.response?.data?.detail || "Failed to initialize vector store");
    } finally {
      setIndexLoading(null);
    }
  };

  const handleIndexAllDocuments = async () => {
    setIndexLoading("index"); setIndexError(""); setIndexSuccess("");
    try {
      const res = await indexAllDocuments(username, password, batchSize);
      setIndexSuccess(res.message || "Documents indexed successfully");
      if (res.total_chunks !== undefined) setIndexSuccess(prev => prev + ` (Chunks: ${res.total_chunks})`);
    } catch (err: any) {
      setIndexError(err.response?.data?.detail || "Failed to index documents");
    } finally {
      setIndexLoading(null);
    }
  };

  const handleGetIndexingStats = async () => {
    setIndexLoading("stats"); setIndexError(""); setIndexSuccess("");
    try {
      const stats = await getIndexingStats(username, password);
      setIndexStats(stats);
      setIndexSuccess("Stats loaded successfully");
    } catch (err: any) {
      setIndexError(err.response?.data?.detail || "Failed to get stats");
      setIndexStats(null);
    } finally {
      setIndexLoading(null);
    }
  };

  const handleClearVectorStore = async () => {
    if (!window.confirm("Are you sure you want to clear the entire vector store? This cannot be undone.")) return;
    setIndexLoading("clear"); setIndexError(""); setIndexSuccess("");
    try {
      const res = await clearVectorStore(username, password);
      setIndexSuccess(res.message || "Vector store cleared successfully");
    } catch (err: any) {
      setIndexError(err.response?.data?.detail || "Failed to clear vector store");
    } finally {
      setIndexLoading(null);
    }
  };

  const handleReindexAllDocuments = async () => {
    if (!window.confirm("This will clear and reindex all documents. Continue?")) return;
    setIndexLoading("reindex"); setIndexError(""); setIndexSuccess("");
    try {
      const res = await reindexAllDocuments(username, password, reindexBatchSize);
      setIndexSuccess(res.message || "Documents reindexed successfully");
      if (res.total_chunks !== undefined) setIndexSuccess(prev => prev + ` (Chunks: ${res.total_chunks})`);
    } catch (err: any) {
      setIndexError(err.response?.data?.detail || "Failed to reindex documents");
    } finally {
      setIndexLoading(null);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h2>Admin Dashboard</h2>
            <p>Manage users and system settings</p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Messages */}
        {error && (
          <div className="message error-message" onClick={clearMessages}>
            {error}
          </div>
        )}
        {success && (
          <div className="message success-message" onClick={clearMessages}>
            {success}
          </div>
        )}

        {/* Search and Create Section */}
        <div className="admin-controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search users by username or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            className="create-user-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancel" : "Create New User"}
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="create-user-form">
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="newUsername">Username</label>
                <input
                  type="text"
                  id="newUsername"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newRole">Role</label>
                <select
                  id="newRole"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="form-input"
                >
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="hr">HR</option>
                  <option value="general">General</option>
                  <option value="c-level">C-Level</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </button>
            </form>
          </div>
        )}

        {/* Index Management Section */}
        <div className="index-management-section">
          <h3>Index Management</h3>
          <div className="index-actions">
            <button className="index-action-button" onClick={handleInitializeVectorStore} disabled={indexLoading === "init"}>
              {indexLoading === "init" ? "Initializing..." : "Initialize Vector Store"}
            </button>
            <div className="index-action-group">
              <input
                type="number"
                min={1}
                value={batchSize}
                onChange={e => setBatchSize(Number(e.target.value))}
                className="batch-size-input"
                disabled={indexLoading === "index"}
              />
              <button className="index-action-button" onClick={handleIndexAllDocuments} disabled={indexLoading === "index"}>
                {indexLoading === "index" ? "Indexing..." : "Index All Documents"}
              </button>
            </div>
            <button className="index-action-button" onClick={handleGetIndexingStats} disabled={indexLoading === "stats"}>
              {indexLoading === "stats" ? "Loading Stats..." : "Get Index Stats"}
            </button>
            <button className="index-action-button danger" onClick={handleClearVectorStore} disabled={indexLoading === "clear"}>
              {indexLoading === "clear" ? "Clearing..." : "Clear Vector Store"}
            </button>
            <div className="index-action-group">
              <input
                type="number"
                min={1}
                value={reindexBatchSize}
                onChange={e => setReindexBatchSize(Number(e.target.value))}
                className="batch-size-input"
                disabled={indexLoading === "reindex"}
              />
              <button className="index-action-button danger" onClick={handleReindexAllDocuments} disabled={indexLoading === "reindex"}>
                {indexLoading === "reindex" ? "Reindexing..." : "Reindex All Documents"}
              </button>
            </div>
          </div>
          {/* Index action messages */}
          {indexError && <div className="message error-message">{indexError}</div>}
          {indexSuccess && <div className="message success-message">{indexSuccess}</div>}
          {/* Stats display */}
          {indexStats && (
            <div className="index-stats">
              <h4>Index Stats</h4>
              <table className="stats-table">
                <tbody>
                  {Object.entries(indexStats).map(([key, value]) => (
                    (typeof value === 'object' && value !== null) ? (
                      <tr key={key}>
                        <td><strong>{key.replace(/_/g, ' ')}</strong></td>
                        <td>
                          {Object.keys(value).length === 0 ? (
                            <span style={{ color: '#888' }}>(empty)</span>
                          ) : (
                            <table className="stats-subtable">
                              <tbody>
                                {Object.entries(value).map(([subKey, subValue]) => (
                                  <tr key={subKey}>
                                    <td>{subKey}</td>
                                    <td>{subValue}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr key={key}>
                        <td><strong>{key.replace(/_/g, ' ')}</strong></td>
                        <td>{String(value)}</td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="users-section">
          <h3>Users ({filteredUsers.length})</h3>
          {isLoading && users.length === 0 ? (
            <div className="loading">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="no-users">
              {searchTerm ? "No users found matching your search." : "No users found."}
            </div>
          ) : (
            <div className="users-list">
              {filteredUsers.map((user) => (
                <div key={user.username} className="user-item">
                  <div className="user-info">
                    <div className="user-username">{user.username}</div>
                    <div className="user-role">{user.role}</div>
                  </div>
                  <div className="user-actions">
                    {user.username !== username && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.username)}
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    )}
                    {user.username === username && (
                      <span className="current-user">Current User</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 