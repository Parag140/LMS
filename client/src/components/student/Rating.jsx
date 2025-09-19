import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(null);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hover || rating);

        return (
          <motion.span
            key={index}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            whileTap={{ scale: 0.8, rotate: -10 }}
            whileHover={{ scale: 1.2 }}
            className={`cursor-pointer text-2xl sm:text-3xl transition-colors duration-300 ${
              isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" : "text-gray-400"
            }`}
          >
            ★
          </motion.span>
        );
      })}
    </div>
  );
};

export default Rating;