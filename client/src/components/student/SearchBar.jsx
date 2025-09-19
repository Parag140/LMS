import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Helper component for the animated glowing border
const FocusGlow = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.5 } }}
    exit={{ opacity: 0, transition: { duration: 0.3 } }}
    className="absolute -inset-0.5 rounded-xl -z-10"
  >
    {/* The spinning gradient that creates the animated border effect */}
    <motion.div
      className="absolute inset-0 rounded-xl bg-[conic-gradient(from_180deg_at_50%_50%,#2a8af6_0deg,#a855f7_180deg,#2a8af6_360deg)]"
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  </motion.div>
);

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");
  const [isFocused, setIsFocused] = useState(false);

  const onSearchHandler = (e) => {
    e.preventDefault();
    // Logic remains unchanged
    if (input.trim()) {
      navigate('/course-list/' + input);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      className="max-w-xl w-full h-14 flex items-center relative group "
      onSubmit={onSearchHandler}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Animated Glow on Focus */}
      <AnimatePresence>
        {isFocused && <FocusGlow />}
      </AnimatePresence>

      {/* Main Container: Dark glassmorphism */}
      <div className="w-full h-full flex items-center px-2 bg-slate-900/60 backdrop-blur-md rounded-xl border border-cyan-400/20 transition-all duration-300 group-hover:border-cyan-400/50 shadow-lg shadow-black/30">
        
        {/* Search Icon: Styled as a button */}
        <motion.button
          type="submit"
          className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg text-cyan-400 transition-colors duration-300 hover:bg-cyan-400/10 hover:text-cyan-300"
          aria-label="Search"
          whileTap={{ scale: 0.9 }}
        >
          <img
            src={assets.search_icon}
            alt="search"
            className="w-5 h-5"
          />
        </motion.button>
        
        {/* Input Field */}
        <input
          type="text"
          placeholder="Enter the matrix of knowledge..."
          className="w-full h-full bg-transparent text-cyan-200 text-lg px-3 placeholder:text-cyan-700/80 outline-none caret-cyan-400"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        
        {/* 'Enter' Key Hint */}
        <div className="hidden sm:flex items-center justify-center h-7 w-12 mr-2 border border-cyan-800 rounded-md bg-slate-900/50 text-cyan-500 text-xs font-sans opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
          Enter
        </div>
      </div>
    </motion.form>
  );
};

export default SearchBar;