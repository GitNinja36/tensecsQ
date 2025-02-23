import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/v1";

function CheckQuestion() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.username || !userData.userId) {
      navigate("/user/createuser");
      return;
    }
    
    const verifyUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/author/all");
        if (!response.ok) throw new Error("Failed to fetch authors");

        const data = await response.json();
        const validUser = data.data.find(
          (user) => user.username === userData.username && user.id === userData.userId
        );

        if (!validUser) {
          navigate("/user/createuser");
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Authorization failed:", error, {
          autoClose: 1000,
        });
        navigate("/user/createuser");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        console.log(userData.userId)
        const response = await axios.get(`${API_BASE_URL}/author/all`);
        const user = response.data.data.find((u) => u.id === userData.userId);

        if (user) {
          if (user.role === "creator") {
            navigate("/");
            toast.error(`${user.role} don't have access to this page`, {
              autoClose: 1000,
            });
            return;
          }
        } else {
          navigate("/user/auth");
          toast.error("You must login first", {
            autoClose: 1000,
          });
          return;
        }

        setUserRole(user.role);
        fetchQuestion();
      } catch (error) {
        toast.error("you must login First", {
          autoClose: 1000,
        });
      }
    };

    fetchUserRole();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/questions?page=1&page_size=1&status=draft`
      );
      setQuestion(response.data.data.result[0] || null);
    } catch (error) {
      toast.error("Error fetching question.", {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const approveQuestion = async (questionId) => {
    try {
      await axios.patch(`${API_BASE_URL}/question/${questionId}`, {
        status: "published",
      });
      toast.success("Question approved successfully", {
        autoClose: 1000,
      });
      fetchQuestion();
    } catch (error) {
      toast.error("Error approving question.", {
        autoClose: 1000,
      });
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`${API_BASE_URL}/question/${questionId}`);
      toast.success("Question deleted successfully", {
        autoClose: 1000,
      });
      fetchQuestion();
    } catch (error) {
      toast.error("Error deleting question.", {
        autoClose: 1000,
      });
    }
  };

  if (!userRole) return null;

  return (
    <div className="container mx-auto p-6 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Final Check - Approve Questions</h2>
      {loading ? (
        <p className="text-gray-600">Loading question...</p>
      ) : question ? (
        <div className="p-6 max-w-lg w-full bg-white shadow-xl rounded-lg border border-gray-200 mb-4">
          {/* Image Preview Section */}
          {question.image_url && (
            <div className="flex justify-center mb-4">
              <img
                src={question.image_url}
                alt="Question Preview"
                className="w-full h-40 object-cover rounded-md shadow-md"
              />
            </div>
          )}

          {/* Question */}
          <h3 className="w-full border p-3 rounded-md bg-gray-100 font-semibold text-lg mb-4">
            {question.question}
          </h3>

          {/* Options */}
          <ul className="w-full ">
            {["option_1", "option_2", "option_3", "option_4"].map((optionKey, index) => (
              <li
                key={index}
                className={`w-full border p-3 rounded-md mb-2 cursor-pointer transition-all ${
                  `option_${question.correct_option}` === optionKey ? "border-green-600 text-green-400 font-bold" : "border-gray-300"
                }`}
              >
                {question[optionKey]}
              </li>
            ))}
          </ul>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700 pb-4">
            <p>
              <strong>Category:</strong> {question.category}
            </p>
            <p>
              <strong>Difficulty:</strong> {question.difficulty}
            </p>
          </div>

          {/* News Summary */}
          <p className="w-full border p-2 rounded mb-4 h-30 ">{question.news_summary}</p>

          {/* Buttons */}
          <div className="flex justify-between mt-6 mb-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md transition-all"
              onClick={() => approveQuestion(question.id)}
            >
              Approve
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md transition-all"
              onClick={() => deleteQuestion(question.id)}
            >
              Delete
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md transition-all"
              onClick={() => navigate(`/question/edit/${question.id}`)}
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No more questions to review.</p>
      )}
    </div>
  );
}

export default CheckQuestion;