import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const login = async (username: string, password: string) => {
  const response = await axios.get(`${BASE_URL}/login`, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const chat = async (username: string, password: string, message: string) => {
    const response = await axios.post(`${BASE_URL}/chat?message=${encodeURIComponent(message)}`, {}, {
        auth: { username, password },
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  return response.data;
};

// Admin API functions
export interface User {
  username: string;
  role: string;
}

export interface UserCreate {
  username: string;
  password: string;
  role: string;
}

export const listUsers = async (username: string, password: string): Promise<User[]> => {
  const response = await axios.get(`${BASE_URL}/admin/users`, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const createUser = async (username: string, password: string, userData: UserCreate) => {
  const response = await axios.post(`${BASE_URL}/admin/users`, userData, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const deleteUser = async (adminUsername: string, adminPassword: string, targetUsername: string) => {
  const response = await axios.delete(`${BASE_URL}/admin/users/${targetUsername}`, {
    auth: { username: adminUsername, password: adminPassword },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// Admin Index Management APIs
export const initializeVectorStore = async (username: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/admin/index/init`, {}, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const indexAllDocuments = async (username: string, password: string, batch_size: number = 50) => {
  const response = await axios.post(`${BASE_URL}/admin/index/documents`, { batch_size }, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const getIndexingStats = async (username: string, password: string) => {
  const response = await axios.get(`${BASE_URL}/admin/index/stats`, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const clearVectorStore = async (username: string, password: string) => {
  const response = await axios.delete(`${BASE_URL}/admin/index/clear`, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const reindexAllDocuments = async (username: string, password: string, batch_size: number = 50) => {
  const response = await axios.post(`${BASE_URL}/admin/index/reindex`, { batch_size }, {
    auth: { username, password },
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
