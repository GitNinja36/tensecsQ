import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "http://localhost:3000/v1";

const NewQuestion = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const referenceData = {
    summary: queryParams.get("summary") || "",
    category: queryParams.get("category") || "",
    url: queryParams.get("url") || "",
  };
  const [forms, setForms] = useState([
    {
      question: referenceData.question || "",
      options: referenceData.options || ["", "", "", ""],
      correctOption: referenceData.correctOption || "",
      category: referenceData.category || "",
      difficulty: referenceData.difficulty || "",
      imageUrl: referenceData.url || "",
      newsSummary: referenceData.summary || "",
    },
  ]);
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
        console.error("Authorization failed:", error, {
          autoClose: 1000,
        });
        navigate("/user/createuser");
      }
    };

    verifyUser();
  }, [navigate]);

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
      setForms((prev) => [...prev, { ...prev[prev.length - 1] }]);
    } else {
      toast.error("You can only add up to 3 forms.", {
        autoClose: 1000,
      });
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
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      toast.error("User authentication failed.", {
        autoClose: 1000,
      });
      return;
    }

    for (const form of forms) {
      if (!form.question.trim() || !form.correctOption || !form.category || !form.difficulty || form.options.some(opt => !opt.trim()) || !form.newsSummary.trim()) {
        toast.error("All fields are required.", {
          autoClose: 1000,
        });
        return;
      }
      if (form.question.length > 100) {
        toast.success("Question limit exceeded more than 100 characters", {
          autoClose: 1000,
        });
        return;
      }
      if (form.options.some(opt => opt.length > 30)) {
        toast.success("Options limit exceeded more than 30 characters", {
          autoClose: 1000,
        });
        return;
      }
      if (form.newsSummary.length > 500) {
        toast.success("Summary limit exceeded more than 500 characters", {
          autoClose: 1000,
        });
        return;
      }
    }
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
        author_id: userData.userId,
      }));

      const response = await fetch(`${API_BASE_URL}/questions/`, {
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

      toast.success("Questions saved successfully!", {
        autoClose: 1000,
      });
      navigate("/");
    } catch (error) {
      console.error("Error saving questions:", error);
      toast.error("Failed to save questions.", {
        autoClose: 1000,
      });
    }
  };
  if (!isAuthorized) return null;

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
              {/* Correct Option */}
              <select
                className="border p-2 rounded"
                value={form.correctOption}
                onChange={(e) => handleChange(index, "correctOption", e.target.value)}
              >
                <option value="">Correct Option</option>
                {form.options.map((_, idx) => (
                  <option key={idx} value={idx + 1}>{`${idx + 1}`}</option>
                ))}
              </select>

              {/* Category */}
              <select
                className="border p-2 rounded"
                value={form.category}
                onChange={(e) => handleChange(index, "category", e.target.value)}
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
              className="w-full border p-2 rounded mb-3"
              placeholder="Enter Image URL"
              value={form.imageUrl}
              onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
            />
            {form.imageUrl && (
              <div className="flex justify-center mb-3">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-100 object-fill rounded shadow-md"
                />
              </div>
            )}
            
            {/* News Summary */}
            <label className="block font-semibold mb-1 ">News Summary</label>
            <textarea
              className="w-full border p-2 rounded mb-4 h-30"
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