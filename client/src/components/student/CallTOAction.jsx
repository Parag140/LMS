import React from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const CallTOAction = () => {
  return (
    <div className="relative flex flex-col items-center gap-6 pt-16 pb-24 px-8 md:px-0 text-center 
                     from-cyan-100/70 to-blue-100/50 overflow-hidden">
      
      {/* Floating glow particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0.3,
            }}
            animate={{
              y: [null, -25, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl md:text-4xl font-bold max-w-2xl mx-auto text-gray-800 leading-tight relative z-10"
      >
        Learn anything, anytime, anywhere
      </motion.h1>

      {/* Sub text */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-gray-600 sm:text-base max-w-xl mx-auto relative z-10"
      >
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
        veniam aliqua proident excepteur commodo do ea.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex items-center font-medium gap-6 mt-4 relative z-10"
      >
        <button className="px-10 py-3 rounded-md text-white 
                           bg-gradient-to-r from-blue-600 to-purple-600 
                           shadow-lg shadow-blue-500/30 
                           hover:shadow-blue-500/60 
                           hover:scale-105 transition-all duration-300">
          Get Started
        </button>
        <button className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-all duration-300">
          Learn More
          <img
            src={assets.arrow_icon}
            alt="arrow_icon"
            className="w-4 h-4 transform group-hover:translate-x-1 transition"
          />
        </button>
      </motion.div>
    </div>
  );
};

export default CallTOAction;
