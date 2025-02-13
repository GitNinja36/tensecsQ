import React, { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [level, setLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchQuestions = async () => {
      const data = [
        { id: 1, text: "What is React?", category: "Tech", difficulty: "Easy", author: "JohnDoe" },
        { id: 2, text: "Who discovered America?", category: "History", difficulty: "Medium", author: "JaneSmith" },
        { id: 3, text: "Capital of France?", category: "Geography", difficulty: "Easy", author: "User123" },
        { id: 4, text: "Biggest planet?", category: "Science", difficulty: "Hard", author: "SpaceGeek" },
        { id: 5, text: "First President of USA?", category: "Politics", difficulty: "Medium", author: "Historian" },
      ];
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    (category ? q.category === category : true) &&
    (difficulty ? q.difficulty === difficulty : true) &&
    (level ? q.difficulty === level : true)
  );

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 mt-12 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-5 pb-5">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate("/question")}>New question</button>
        <div className="flex space-x-2">
          <Dropdown options={["current affairs", "politics", "history"]} name="Category" onChange={setCategory} />
          <Dropdown options={["easy", "medium", "hard"]} name="Difficulty" onChange={setDifficulty} />
          <Dropdown options={["easy", "medium", "hard"]} name="Level" onChange={setLevel} />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((question) => (
            <div key={question.id} className="flex justify-between items-center border-b p-3 last:border-none">
              <span className="flex-1">{question.text}</span>
              <span className="w-1/6 text-center">{question.category}</span>
              <span className="w-1/6 text-center">{question.difficulty}</span>
              <span className="w-1/6 text-center">{question.author}</span>
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
        <button disabled={currentPage === 1} className="border px-4 py-2 rounded disabled:opacity-50" onClick={() => setCurrentPage(currentPage - 1)}>Back</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} className="border px-4 py-2 rounded disabled:opacity-50" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Dashboard;