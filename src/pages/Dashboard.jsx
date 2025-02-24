import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =import.meta.env.VITE_BACKEND_BASE_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.username || !userData.userId) {
      navigate("/user/createuser");
      return;
    }
    
    const verifyUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/author/all`);
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
        console.error("Authorization failed:", error);
        navigate("/user/createuser");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    fetchQuestions();
    fetchAuthors();
  }, [category, difficulty, author, date, currentPage]);

  const fetchQuestions = async () => {
    try {
      setError(null);
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
        category: category || undefined,
        difficulty: difficulty || undefined,
        author_id: author || undefined,
        news_date: date || undefined,
      };

      const response = await axios.get(`${API_BASE_URL}/questions/`, { params });
      
      if (response.data?.data?.result.length > 0) {
        setQuestions(response.data.data.result);
        setNextPage(response.data.data.next_page);
      } else {
        setQuestions([]);
        setNextPage(null);
      }
    } catch (err) {
      setQuestions([]);
      setNextPage(null);
      setError(err.response?.data?.message || "An error occurred while fetching data.");
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/author/all?role=creator`);
      setAuthors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 mt-12 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate("/question")}>New</button>
        <div className="flex space-x-2">
          <select className="border px-4 py-2 rounded bg-gray-100" onChange={(e) => handleFilterChange(setCategory, e.target.value)}>
            <option value="">Category</option>
            <option value="sports">sports</option>
            <option value="politics">politics</option>
            <option value="history">history</option>
            <option value="world">world</option>
            <option value="technology">technology</option>
            <option value="entertainment">entertainment</option>
            <option value="business">business</option>
            <option value="health">health</option>
            <option value="science">science</option>
            <option value="education">education</option>
            <option value="lifestyle">lifestyle</option>
            <option value="finance">finance</option>
            <option value="startup">startup</option>
            <option value="trending">trending</option>
          </select>
          <select className="border px-4 py-2 rounded bg-gray-100" onChange={(e) => handleFilterChange(setDifficulty, e.target.value)}>
            <option value="">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className="border px-4 py-2 rounded bg-gray-100" onChange={(e) => handleFilterChange(setAuthor, e.target.value)}>
            <option value="">Author</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.username}</option>
            ))}
          </select>
          <input
            type="date"
            className="border px-4 py-2 mx-1 rounded bg-gray-100 w-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={(e) => handleFilterChange(setDate, e.target.value)}
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex justify-between bg-gray-100 p-3 font-bold">
          <span className="flex-1 ">Questions</span>
          <span className="w-1/6 text-center pl-25">Author</span>
          <span className="w-1/6 text-center pl-23">Category</span>
          <span className="w-1/6 text-center pl-24">Difficulty</span>
          <span className="w-1/6 text-center pl-25">Date</span>
          <span className="w-1/12 text-center pl-10">Edit</span>
        </div>
        {questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className="flex justify-between items-center border-b p-3 last:border-none">
              <span className="flex-1 ">{question.question}</span>
              <span className="w-1/6 text-center">{question.author?.username || "Unknown"}</span>
              <span className="w-1/6 text-center">{question.category}</span>
              <span className="w-1/6 text-center">{question.difficulty}</span>
              <span className="w-1/6 text-center">{question.news_date}</span>
              <button className="p-1 text-lg" onClick={() => navigate(`/question/edit/${question.id}`)}>
                <i className="uil uil-edit"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="text-center p-3">No questions found</div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          disabled={currentPage === 1}
          className="border px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Back
        </button>
        <span>{currentPage}</span>
        <button
          disabled={!nextPage}
          className="border px-4 py-2 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;