import React, { useState } from "react";
import Dropdown from "../components/Dropdown";

const QuestionForm = ({ index, onRemove }) => {
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
    <div className="p-6 bg-white shadow-md rounded-lg">
      <textarea 
        className="w-full border p-2 rounded mb-4" 
        placeholder="Question" 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)}
      ></textarea>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {options.map((option, idx) => (
          <input 
            key={idx} 
            className="border p-2 rounded" 
            placeholder={`Option ${idx + 1}`} 
            value={option} 
            onChange={(e) => handleOptionChange(idx, e.target.value)}
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
          {options.map((option, idx) => (
            <option key={idx} value={option}>{`Option ${idx + 1}`}</option>
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
        <div className="border p-5 rounded text-center">
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
        <button className="border px-4 py-2 rounded hover:bg-gray-200 active:bg-gray-300 transition" onClick={handleReset}>Reset</button>
        {index > 0 && (
          <button className="border px-4 py-2 rounded text-red-500 hover:bg-red-200 active:bg-red-300 transition" onClick={() => onRemove(index)}>Remove</button>
        )}
      </div>
    </div>
  );
};

const NewQuestion = () => {
  const [forms, setForms] = useState([{}]);

  const handleDuplicate = () => {
    setForms((prev) => [...prev, {}]);
  };

  const handleRemove = (index) => {
    setForms((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <div className={`${forms.length === 1 ? 'max-w-2xl mx-auto' : 'grid grid-cols-2 gap-6'}`}>
        {forms.map((_, index) => (
          <QuestionForm key={index} index={index} onRemove={handleRemove} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="border px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 active:bg-gray-400 transition text-gray-800 font-semibold"
          onClick={handleDuplicate}
        >
          Duplicate
        </button>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition font-semibold">
          Save
        </button>
      </div>
    </div>
  );
};

export default NewQuestion;