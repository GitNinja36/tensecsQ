import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Authority() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    password: "",
    email: "",
    phone_number: "",
    role: "creator",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      try {
        const response = await axios.get("http://localhost:3000/v1/author/all");
        const users = response.data.data;
        const currentUser = users.find((user) => user.id === userData.userId);
        if (currentUser) {
          if ((currentUser.role == "editor" || currentUser.role == "creator")) {
            navigate("/");
            toast.error(`${currentUser.role} don't have access to Create User`)
            return;
          }
        } else{
            navigate("/user/auth");
            toast.error(`You must login first`)
            return;
        }
        setUserData(currentUser);
      } catch (error) {
        console.error("Error fetching user data", error);
        navigate("/user/auth");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/v1/author/", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.data) {
        toast.success(`Now ${response.data.data.username} becomes ${response.data.data.role}`);
        navigate("/");
      }
    } catch (error) {
      toast.error("Incorrect input");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Author</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          {/* Role Dropdown */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg bg-white"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="creator">Creator</option>
          </select>
          <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default Authority;