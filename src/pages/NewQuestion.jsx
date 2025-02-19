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
    if (forms.length < 3) {
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
    } else {
      alert("You can only add up to 3 forms.");
    }
  };

  const handleReset = (index) => {
    setForms((prev) =>
      prev.map((form, idx) =>
        idx === index
          ? {
              question: "",
              options: ["", "", "", ""],
              correctOption: "",
              category: "",
              difficulty: "",
              imageUrl: "",
              newsSummary: "",
            }
          : form
      )
    );
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
      alert("Failed to save questions.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      {/* Form Container */}
      <div className={`grid grid-cols-${forms.length > 1 ? "3" : "1"} gap-6`}>
        {forms.map((form, index) => (
          <div key={index} className="p-4 border rounded-lg bg-gray-100 w-full">
            {/* Question Input */}
            <label className="block font-semibold mb-1">Question</label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter question"
              value={form.question}
              onChange={(e) => handleChange(index, "question", e.target.value)}
            />

            {/* Options Input */}
            <label className="block font-semibold mb-1">Options</label>
            <div className="grid grid-rowss-2 gap-4 mb-4">
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

            {/* Dropdowns */}
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
                value={form.difficulty}
                onChange={(e) => handleChange(index, "difficulty", e.target.value)}
              >
                <option value="">Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* URL Input */}
            <label className="block font-semibold mb-1">Image URL</label>
            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter Image URL"
              value={form.imageUrl}
              onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
            />
            {form.imageUrl && (
              <div className="flex justify-center mt-2">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-48 h-32 object-cover rounded shadow-md"
                />
              </div>
            )}
            
            {/* News Summary */}
            <label className="block font-semibold mb-1">News Summary</label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter news summary"
              value={form.newsSummary}
              onChange={(e) => handleChange(index, "newsSummary", e.target.value)}
            />

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                className={`px-4 py-2 rounded-lg text-white ${
                  forms.length === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 transition"
                }`}
                disabled={forms.length === 1}
                onClick={() => setForms((prev) => prev.filter((_, i) => i !== index))}
              >
                Remove
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 transition"
                onClick={handleDuplicate}
              >
                Duplicate
              </button>
              <button
                className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition"
                onClick={() => handleReset(index)}
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 text-center">
        <button
          className="px-6 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NewQuestion;