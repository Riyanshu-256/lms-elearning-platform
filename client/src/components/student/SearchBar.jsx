import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : " ");

  // To handle search
  const onSearchHandller = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandller}
      className="max-w-xl w-full h-14 flex items-center bg-white rounded-2xl shadow-md border border-gray-200 focus-within:ring-2 focus-within:ring-blue-200 transition"
    >
      {/* Icon */}
      <img
        src={assets.search_icon}
        alt="search_icon"
        className="w-5 ml-4 opacity-60"
      />

      {/* Input */}
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search for courses, skills..."
        className="flex-1 h-full px-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
      />

      {/* Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-8 py-2.5 mr-2 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
