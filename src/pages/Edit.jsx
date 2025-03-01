import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_BASE_URL =import.meta.env.VITE_BACKEND_BASE_URL;

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
      const response = await axios.get(`${API_BASE_URL}/question/${id}`);
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
    if (!question || !correctOption || !category || !difficulty || options.some(opt => !opt) || !newsSummary) {
      toast.error("All fields must be filled and dropdowns must be selected!", {
        autoClose: 1000,
      });
      return;
    }

    if (question.length > 100) {
      toast.error("Question limit exceeded (max 100 characters)", {
        autoClose: 1000,
      });
      return;
    }

    if (options.some(opt => opt.length > 30)) {
      toast.error("Options limit exceeded (max 30 characters)", {
        autoClose: 1000,
      });
      return;
    }

    if (newsSummary.length > 500) {
      toast.error("Summary limit exceeded (max 500 characters)", {
        autoClose: 1000,
      });
      return;
    }
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
        image_url: newsUrl,
        news_summary: newsSummary,
      };

      await axios.patch(`${API_BASE_URL}/question/${id}`, updatedData);
      toast.success("Question updated successfully!", {
        autoClose: 1000,
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/question/${id}`);
      toast.success("Question deleted successfully!", {
        autoClose: 1000,
      });
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
        className="w-full border p-2 rounded mb-4 "
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      {/* Options Inputs */}
      {options.map((option, index) => (
        <input
          key={index}
          className="w-full border p-2 rounded mb-2 "
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}

      {/* Dropdowns */}
      <div className="grid grid-cols-3 gap-2 mb-4">

        {/* Correct Option */}
        <select
          className="border p-2 rounded"
          value={correctOption}
          onChange={(e) => setCorrectOption(Number(e.target.value))}
        >
          <option value="">Correct Option</option>
          {options.map((_, index) => (
            <option key={index} value={index + 1}>{`${index + 1}`}</option>
          ))}
        </select>

        {/* Category */}
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Category</option>
          <option value="sports">Sports</option>
          <option value="politics">Politics</option>
          <option value="history">History</option>
          <option value="world">World</option>
          <option value="technology">Technology</option>
          <option value="entertainment">Entertainment</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="education">Education</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="finance">Finance</option>
          <option value="startup">Startup</option>
          <option value="trending">Trending</option>
        </select>

        {/* Difficulty */}
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
        className="w-full border p-2 rounded mb-3"
        placeholder="Enter Image URL"
        value={newsUrl}
        onChange={(e) => setnewsUrl(e.target.value)}
      />
      {newsUrl && (
        <div className="flex justify-center mb-3">
          <img
            src={newsUrl}
            alt="Preview"
            className="w-full h-100 object-fill rounded shadow-md"
          />
        </div>
      )}

      {/* News Summary */}
      <textarea
        className="w-full border p-2 rounded mb-4 h-30 "
        placeholder="News Summary"
        value={newsSummary}
        onChange={(e) => setNewsSummary(e.target.value)}
      />

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          className="border px-4 py-2 rounded bg-gray-200 hover:bg-gray-300  transition"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
        <button
          className="border px-4 py-2 rounded bg-red-300 hover:bg-red-400  transition"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="border px-4 py-2 rounded bg-lime-300 hover:bg-lime-400 transition"
          onClick={handleUpdate}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Edit;