import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [newsUrl, setnewsUrl] = useState("");
  const [newsSummary, setNewsSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/v1/question/${id}`);
      const questionData = response.data.data;

      if (questionData) {
        setQuestion(questionData.question);
        setOptions([
          questionData.option_1,
          questionData.option_2,
          questionData.option_3,
          questionData.option_4,
        ]);
        setCorrectOption(questionData.correct_option);
        setCategory(questionData.category);
        setDifficulty(questionData.difficulty);
        setnewsUrl(questionData.image_url);
        setNewsSummary(questionData.news_summary || "");
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        question,
        option_1: options[0],
        option_2: options[1],
        option_3: options[2],
        option_4: options[3],
        correct_option: correctOption,
        category,
        difficulty,
        news_summary: newsSummary,
      };

      await axios.patch(`http://localhost:3000/v1/question/${id}`, updatedData);
      alert("Question updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/v1/question/${id}`);
      alert("Question deleted successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg mt-10 border">
      {/* Question Input */}
      <textarea
        className="w-full border p-2 rounded mb-4"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options Inputs */}
      {options.map((option, index) => (
        <input
          key={index}
          className="w-full border p-2 rounded mb-2"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}

      {/* Dropdowns */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={correctOption}
          onChange={(e) => setCorrectOption(Number(e.target.value))}
        >
          <option value="">Correct Option</option>
          {options.map((_, index) => (
            <option key={index} value={index + 1}>{`Option ${index + 1}`}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
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

        <select
          className="border p-2 rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Image URL */}
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter Image URL"
        value={newsUrl}
        onChange={(e) => setnewsUrl(e.target.value)}
      />
      {newsUrl && (
        <div className="flex justify-center mt-2">
          <img
            src={newsUrl}
            alt="Preview"
            className="w-48 h-32 object-cover rounded shadow-md"
          />
        </div>
      )}

      {/* News Summary */}
      <textarea
        className="w-full border p-2 rounded mb-4"
        placeholder="News Summary"
        value={newsSummary}
        onChange={(e) => setNewsSummary(e.target.value)}
      />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          className="border px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
        <button
          className="border px-4 py-2 rounded hover:bg-red-200 active:bg-red-300 transition"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="border px-4 py-2 rounded hover:bg-yellow-200 active:bg-yellow-300 transition"
          onClick={handleUpdate}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Edit;