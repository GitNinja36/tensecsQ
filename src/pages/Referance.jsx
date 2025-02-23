import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Referance() {
  const [news, setNews] = useState([]);
  const [sources, setSources] = useState(["ndtv", "hindustan_times", "times_of_india", "aaj_tak"]);
  const [categories, setCategories] = useState([
    "sports", "politics", "history", "world", "technology",
    "entertainment", "business", "health", "science", "education",
    "lifestyle", "finance", "startup", "trending"
  ]);
  const [source, setSource] = useState("times_of_india");
  const [category, setCategory] = useState("sports");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData || !userData.username || !userData.userId) {
      navigate("/user/createuser");
      return;
    }
    
    const verifyUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/v1/author/all");
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

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/v1/news?source=${source}&category=${category}`)
      .then(response => {
        if (response.data?.data && Array.isArray(response.data.data)) {
          setNews(response.data.data);
        } else {
          console.error("Invalid API response format:", response.data);
          setNews([]);
        }
      })
      .catch(error => {
        console.error("Error fetching news:", error);
        setNews([]);
      })
      .finally(() => setLoading(false));
  }, [source, category]);

  const handleQuestionCreate = async (newsItem) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || !userData.userId) {
        toast.error("User not found. Please log in.", {
          autoClose: 1000,
        });
        return;
      }

      const questionData = [
        {
          question: newsItem.title || "Untitled Question",
          option_1: "Option 1",
          option_2: "Option 2",
          option_3: "Option 3",
          option_4: "Option 4",
          correct_option: 1,
          category: category || "general",
          difficulty: "easy",
          image_url: newsItem.image_url || "https://via.placeholder.com/150",
          news_summary: newsItem.summary || "No summary available.",
          status: "draft",
          author_id: userData.userId
        }
      ];

      console.log("Sending question data:", questionData); 

      const response = await axios.post("http://localhost:3000/v1/questions/", questionData);

      if (response.status === 201) {
        toast.success("Question created successfully", {
          autoClose: 1000,
        });

        const questionsResponse = await axios.get("http://localhost:3000/v1/questions?page_size=100");

        if (questionsResponse.status === 200 && questionsResponse.data.data.result) {
          console.log(questionsResponse.data.data.result)
          const createdQuestion = questionsResponse.data.data.result.find(q => q.question === newsItem.title);
          console.log(createdQuestion);
          if (createdQuestion) {
            navigate(`/question/edit/${createdQuestion.id}`);
          } else {
            toast.error("Question created but not found in the list.", {
              autoClose: 1000, 
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast.error("Failed to create question. Please check console for details.", {
        autoClose: 1000, 
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Dropdown Filters */}
      <div className="flex justify-between mb-6">
        <select
          className="border px-4 py-2 rounded-md text-gray-700 shadow-sm"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value="">Select Source</option>
          {sources.map((src, index) => (
            <option key={index} value={src}>{src.replace(/_/g, " ").toUpperCase()}</option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded-md text-gray-700 shadow-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="text-center text-gray-600 text-lg">Loading news...</div>}

      {/* News Grid */}
      {!loading && news.length === 0 && <div className="text-center text-gray-600 text-lg">No news found.</div>}

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md bg-white flex flex-col h-full">
            <img src={item.image_url || "https://via.placeholder.com/150"} alt={item.title} className="w-full h-40 object-cover rounded-md" />
            <h2 className="font-bold text-lg mt-3 mb-2">{item.title || "No Title"}</h2>
            <p className="text-gray-600 text-sm flex-grow">{item.summary || "No summary available."}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 w-full"
              onClick={() => handleQuestionCreate(item)}
            >
              Question
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Referance;