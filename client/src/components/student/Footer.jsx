import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="w-full bg-gradient-to-t from-gray-900 to-gray-950 md:px-36 mt-16 relative overflow-hidden"
    >
      {/* Background elements for virtual feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: 0.3
            }}
            animate={{ 
              y: [null, -20, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start px-8 ms:px-0 justify-center gap-10 md:gap-32 py-14 border-b border-white/10 relative z-10">
        {/* Logo and description section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:items-start items-center w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={assets.logo_dark} alt="logo" className="drop-shadow-[0_0_15px_rgba(100,100,255,0.3)]" />
          </motion.div>
          <p className="mt-6 text-center md:text-left text-sm text-white/80 leading-relaxed max-w-xs">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </motion.div>

        {/* Company links section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col md:items-start items-center w-full"
        >
          <h2 className="font-semibold text-white mb-5 text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Company
          </h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-3">
            {["Home", "About us", "Contact us", "Privacy policy"].map((item, index) => (
              <motion.li 
                key={item}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 500 }}
                className="group cursor-pointer"
              >
                <a href="#" className="transition-all duration-300 group-hover:text-blue-400 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Newsletter section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="hidden md:flex flex-col items-start w-full"
        >
          <h2 className="font-semibold text-white mb-5 text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/80 mb-4">The latest news, articles, and resources, sent to your inbox weekly.</p>
          <div className="flex items-center gap-2 pt-2">
            <motion.input 
              whileFocus={{ scale: 1.02 }}
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-500/30 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 outline-none w-64 h-11 rounded-lg px-4 text-sm transition-all duration-300 focus:ring-2 focus:ring-blue-500/50"
            />
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 w-24 h-11 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Copyright section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        viewport={{ once: true }}
        className="py-6 relative z-10"
      >
        <p className="text-center text-xs md:text-sm text-white/60">
          Copyright 2024 © GreatStack. All Right Reserved.
        </p>
        
        {/* Animated dots for visual interest */}
        <div className="flex justify-center mt-4 space-x-2">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0 }}
            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            className="w-1.5 h-1.5 bg-purple-400 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
          />
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;