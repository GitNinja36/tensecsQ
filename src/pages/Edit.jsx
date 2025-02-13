import React, { useState } from "react";
import Dropdown from "../components/Dropdown";

const Edit = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [image, setImage] = useState(null);
  const [newsSummary, setNewsSummary] = useState("");

  const handleOptionChange = (index, value) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const handleReset = () => {
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption("");
    setCategory("");
    setDifficulty("");
    setImage(null);
    setNewsSummary("");
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-10 border">
      <textarea 
        className="w-full border p-2 rounded mb-4" 
        placeholder="Question" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
      ></textarea>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {options.map((option, index) => (
          <input 
            key={index} 
            className="border p-2 rounded" 
            placeholder={`Option ${index + 1}`} 
            value={option} 
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <select 
          className="border p-2 rounded" 
          value={correctOption} 
          onChange={(e) => setCorrectOption(e.target.value)}
        >
          <option value="">Correct Option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{`Option ${index + 1}`}</option>
          ))}
        </select>
        
        <Dropdown 
          options={["current affairs", "politics", "history"]} 
          name="Category" 
          className="border p-2 rounded" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="Category"
        />
        
        <Dropdown 
          options={["easy", "medium", "hard"]} 
          name="Difficulty" 
          className="border p-2 rounded" 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value)} 
          placeholder="Difficulty"
        />
      </div>
      
      <div className="grid grid-rows-2 gap-4 mb-4">
        <div className="border p-6 rounded text-center">
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <textarea 
          className="border p-2 rounded w-full" 
          placeholder="News Summary" 
          value={newsSummary} 
          onChange={(e) => setNewsSummary(e.target.value)}
        ></textarea>
      </div>
      
      <div className="flex justify-between">
        <button 
          className="border px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition"
          onClick={handleReset}
        >
          Cancel
        </button>
        <button 
          className="border px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition"
        >
          Delete
        </button>
        <button 
          className="border px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition"
        >
          Edit
        </button>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Edit;