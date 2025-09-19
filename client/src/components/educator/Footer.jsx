import React from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: assets.facebook_icon, name: "Facebook", url: "#" },
    { icon: assets.twitter_icon, name: "Twitter", url: "#" },
    { icon: assets.instagram_icon, name: "Instagram", url: "#" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-t from-indigo-900/30 to-purple-900/20 backdrop-blur-2xl border-t border-white/20"
    >
      {/* Floating particles background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
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
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex md:flex-row flex-col-reverse items-center justify-between py-8 gap-4">
          {/* Left Section - Logo and Copyright */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <img
                  className="hidden md:block w-20 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  src={assets.logo}
                  alt="GreatStack Logo"
                />
                {/* Logo glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            </Link>
            
            <div className="hidden md:block h-7 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="py-4 text-center text-xs md:text-sm text-white/80 font-medium bg-gradient-to-r from-white/10 to-transparent px-4 py-2 rounded-full"
            >
              Copyright {currentYear} © GreatStack. All Rights Reserved.
            </motion.p>
          </motion.div>

          {/* Right Section - Social Links */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-5 max-md:mt-4"
          >
            {socialLinks.map((social, index) => (
              <motion.div
                key={social.name}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 500 }}
              >
                {/* Outer glow ring */}
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                
                <motion.a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative flex items-center justify-center w-12 h-12 bg-black/30 rounded-full border border-white/20 backdrop-blur-sm shadow-lg"
                >
                  <img
                    src={social.icon}
                    alt={`${social.name} icon`}
                    className="w-6 h-6 transition-all duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                </motion.a>
                
                {/* Tooltip */}
                <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/70 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  {social.name}
                </span>
                
                {/* Hover particle effect */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Logo - Only visible on mobile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:hidden flex justify-center pb-6"
        >
          <Link to="/">
            <div className="relative">
              <img
                className="w-16 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                src={assets.logo}
                alt="GreatStack Logo"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;