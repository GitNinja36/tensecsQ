import React from "react";
import Dropdown from "../components/Dropdown";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 mt-12 max-w-7xl mx-auto bg-white shadow-md rounded-lg">
      {/* Filters and New Button */}
      <div className="flex justify-between items-center mb-5 pb-5">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={()=>{
          navigate('/question')
        }}>New question</button>
        <div className="flex space-x-2">
          <Dropdown options={['current affairs', 'politics', 'history']} name="Category" />
          <Dropdown options={['easy', 'medium', 'hard']} name="Difficulty" />
          <Dropdown options={['easy', 'medium', 'hard']} name="Level" />
        </div>
      </div>
      
      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b p-3 last:border-none"
          >
            <span className="flex-1">Question Text ...</span>
            <span className="w-1/6 text-center">Category</span>
            <span className="w-1/6 text-center">Difficulty</span>
            <span className="w-1/6 text-center">Author Username</span>
            <button className="p-1 text-lg" onClick={()=>{
              navigate("/question/edit")
            }}><i class="uil uil-edit"></i></button>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button className="border px-4 py-2 rounded">Back</button>
        <span>1</span>
        <button className="border px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default Dashboard;