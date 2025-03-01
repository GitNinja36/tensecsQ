import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =import.meta.env.VITE_BACKEND_BASE_URL;

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/author/verify-creds`, {
        username,
        password,
      });

      if (response.data.valid) {
        const expires = new Date().getTime() + 60 * 60 * 1000;
        const userData = {
          userId: response.data.data.id,
          username: response.data.data.username,
          expires,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success("Welcome to the dashboard!", {
          autoClose: 1000,
        });
        navigate("/");
      } else {
        toast.error("Incorrect username or password.", {
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", {
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;