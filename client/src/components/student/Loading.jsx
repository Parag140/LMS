import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const Loading = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  // State for the countdown timer
  const [countdown, setCountdown] = useState(5);

  // The destination path from the URL, using '*' for wildcard routes
  const destinationPath = params['*'];

  useEffect(() => {
    // Only run the logic if a destination path is provided
    if (destinationPath) {
      // Interval to update the countdown every second
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      // Timer to navigate after 5 seconds
      const navigationTimer = setTimeout(() => {
        navigate(`/${destinationPath}`);
      }, 5000);

      // Cleanup function to clear timers when the component unmounts
      return () => {
        clearInterval(countdownInterval);
        clearTimeout(navigationTimer);
      };
    }
  }, [destinationPath, navigate]); // Correct dependency array

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white overflow-hidden">
      
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-400/20 rounded-full"
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              scale: Math.random() * 0.5 + 0.5,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * 200 - 100],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
            style={{
                width: `${Math.random() * 60 + 20}px`,
                height: `${Math.random() * 60 + 20}px`,
            }}
          />
        ))}
      </div>
      
      {/* Main Content Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 p-8 bg-black/30 backdrop-blur-md rounded-2xl border border-cyan-400/20 shadow-2xl shadow-cyan-500/10"
      >
        {/* The Virtual Loader */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <motion.div
            className="absolute w-full h-full border-2 border-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Inner Counter-Rotating Ring */}
          <motion.div
            className="absolute w-2/3 h-2/3 border-2 border-fuchsia-500 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          {/* Core Orb */}
          <motion.div
            className="absolute w-1/3 h-1/3 bg-white rounded-full shadow-[0_0_20px_theme(colors.white)]"
            animate={{ scale: [1, 0.8, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Text and Countdown */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">
            Initializing Interface
          </h1>
          <p className="text-gray-400 mt-2">
            Redirecting in {countdown}...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;
