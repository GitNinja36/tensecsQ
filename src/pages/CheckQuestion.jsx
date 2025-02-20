import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:3000/v1";

function CheckQuestion() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          toast.error("Unauthorized access.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/author/all`);
        const user = response.data.data.find((u) => u.id === userId);
        
        if (!user || (user.role !== "editor" && user.role !== "admin")) {
          toast.error("You do not have permission to access this page.");
          return;
        }
        
        setUserRole(user.role);
        fetchQuestions();
      } catch (error) {
        toast.error("Error fetching user role.");
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/questions?page=1&page_size=10&status=draft`);
        setQuestions(response.data.data.result);
      } catch (error) {
        toast.error("Error fetching questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const toggleApproval = async (questionId, currentStatus) => {
    try {
      const newStatus = currentStatus === "draft" ? "published" : "draft";

      const response = await axios.patch(`${API_BASE_URL}/question/${questionId}`, { status: newStatus });

      if (response.data.data.status === newStatus) {
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === questionId ? { ...q, status: newStatus } : q
          )
        );

        toast.success(`Question has been ${newStatus === "published" ? "approved" : "reverted"}`);
      }
    } catch (error) {
      toast.error("Error updating question status.");
    }
  };

  if (!userRole) return null;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Questions for Approval</h2>
      
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Question</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Difficulty</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="text-center">
                <td className="p-2 border">{q.question}</td>
                <td className="p-2 border">{q.category}</td>
                <td className="p-2 border">{q.difficulty}</td>
                <td className="p-2 border">{q.news_date}</td>
                <td className="p-2 border">
                  <button
                    className={`p-1 px-3 rounded ${
                      q.status === "draft" ? "bg-yellow-500" : "bg-green-500"
                    } text-white`}
                    onClick={() => toggleApproval(q.id, q.status)}
                  >
                    {q.status === "draft" ? "Not Approved" : "Approved"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CheckQuestion;
