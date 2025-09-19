import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center  from-cyan-100/70 to-blue-100/50 overflow-hidden">
      
      {/* Animated background floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0.3
            }}
            animate={{ y: [null, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Heading */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="md:text-5xl text-3xl relative font-bold text-gray-800 max-w-3xl mx-auto leading-tight"
      >
        Empower your future with the courses designed to{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          fit your choice
        </span>
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0 drop-shadow-[0_5px_15px_rgba(100,100,255,0.3)]"
        />
      </motion.h1>

      {/* Sub Text */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }} 
        className="md:block hidden text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
      >
        We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.
      </motion.p>
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4, duration: 0.5 }} 
        className="md:hidden text-gray-600 max-w-sm mx-auto"
      >
        We bring together world-class instructors to help <br /> you achieve your professional goals
      </motion.p>

      {/* SearchBar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }} className="relative z-10">
        <SearchBar />
      </motion.div>
    </div>
  );
};

export default Hero;