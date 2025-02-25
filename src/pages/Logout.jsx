import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("userData");
    toast.success("Logged out successfully!", {
      autoClose: 1000,
    });
    navigate("/user/auth");
  }, [navigate]);

  return null;
};

export default Logout;