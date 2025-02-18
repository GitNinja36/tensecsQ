import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewQuestion = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([
    {
      question: "",
      options: ["", "", "", ""],
      correctOption: "",
      category: "",
      difficulty: "",
      imageUrl: "",
      newsSummary: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    setForms((prev) =>
      prev.map((form, idx) =>
        idx === index ? { ...form, [field]: value } : form
      )
    );
  };

  const handleOptionChange = (formIndex, optionIndex, value) => {
    setForms((prev) =>
      prev.map((form, idx) =>
        idx === formIndex
          ? { ...form, options: form.options.map((opt, i) => (i === optionIndex ? value : opt)) }
          : form
      )
    );
  };

  const handleDuplicate = () => {
    setForms((prev) => [
      ...prev,
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: "",
        category: "",
        difficulty: "",
        imageUrl: "",
        newsSummary: "",
      },
    ]);
  };

  const handleReset = () => {
    setForms([
      {
        question: "",
        options: ["", "", "", ""],
        correctOption: "",
        category: "",
        difficulty: "",
        imageUrl: "",
        newsSummary: "",
      },
    ]);
  };

  const handleSave = async () => {
    try {
      const requestData = forms.map((form) => ({
        question: form.question,
        option_1: form.options[0],
        option_2: form.options[1],
        option_3: form.options[2],
        option_4: form.options[3],
        correct_option: parseInt(form.correctOption),
        category: form.category,
        difficulty: form.difficulty,
        image_url: form.imageUrl,
        news_summary: form.newsSummary,
        status: "draft",
      }));
  
      const response = await fetch("http://localhost:3000/v1/questions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      alert("Questions saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Failed to save questions. Check console for details.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      {forms.map((form, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-100">
          <textarea
            className="w-full border p-2 rounded mb-4"
            placeholder="Question"
            value={form.question}
            onChange={(e) => handleChange(index, "question", e.target.value)}
          />

          <div className="grid grid-rows-2 gap-4 mb-4">
            {form.options.map((option, idx) => (
              <input
                key={idx}
                className="border p-2 rounded"
                placeholder={`Option ${idx + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, idx, e.target.value)}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <select
              className="border p-2 rounded"
              value={form.correctOption}
              onChange={(e) => handleChange(index, "correctOption", e.target.value)}
            >
              <option value="">Correct Option</option>
              {form.options.map((_, idx) => (
                <option key={idx} value={idx + 1}>{`Option ${idx + 1}`}</option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={form.category}
              onChange={(e) => handleChange(index, "category", e.target.value)}
            >
              <option value="">Category</option>
              <option value="current affairs">Current Affairs</option>
              <option value="politics">Politics</option>
              <option value="history">History</option>
            </select>

            <select
              className="border p-2 rounded"
              value={form.difficulty}
              onChange={(e) => handleChange(index, "difficulty", e.target.value)}
            >
              <option value="">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="URL"
            value={form.imageUrl}
            onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
          />

          <textarea
            className="w-full border p-2 rounded mb-4"
            placeholder="News Summary"
            value={form.newsSummary}
            onChange={(e) => handleChange(index, "newsSummary", e.target.value)}
          />

          {index >= 0 && (
            <button
              className="border px-4 py-2 rounded text-red-500 hover:bg-red-200 transition"
              onClick={() => setForms((prev) => prev.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          className="border px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 transition"
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className="border px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 transition"
          onClick={handleDuplicate}
        >
          Duplicate
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NewQuestion;