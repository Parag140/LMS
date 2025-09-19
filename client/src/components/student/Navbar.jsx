import React, { useContext } from "react";
import { assets } from "../../assets/assets.js";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator, setIsEducator, backendUrl, getToken } = useContext(AppContext);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(backendUrl + '/api/educator/update-role', {
        headers: { authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setIsEducator(true)
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.") // Safer error handling
    }
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 flex items-center justify-between 
                  px-4 sm:px-6 md:px-8 lg:px-10 py-3
                  // --- STYLE CHANGES ARE HERE ---
                  bg-gradient-to-r from-cyan-100/90 via-sky-200/80 to-blue-300/80 // Matched gradient
                  backdrop-blur-xl // Kept for the glass effect
                  border-b border-white/40 // Made border slightly more visible
                  shadow-lg shadow-blue-200/50 // Softer, more thematic shadow
                  // --- END OF STYLE CHANGES ---
                  ${isCourseListPage ? "rounded-b-xl mx-2 sm:mx-4" : ""}`} // Added responsive margin
    >
      {/* Logo with 3D effect */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="cursor-pointer relative"
      >
        <img
          src={assets.logo}
          alt="logo"
          className="w-28 lg:w-32 drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        />
        {/* Logo glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
      </motion.div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <div className="flex items-center gap-5 text-gray-700">
          {user &&
            <>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={becomeEducator}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                         text-white font-medium shadow-lg shadow-indigo-500/30
                         transition-all duration-300 hover:shadow-indigo-500/50"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </motion.button>
              <span className="text-gray-300">|</span> {/* Adjusted separator color */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Link 
                  to="/my-enrollments" 
                  className="px-3 py-2 rounded-lg bg-white/20 backdrop-blur-sm 
                           border border-white/30 text-gray-700 font-medium
                           transition-all duration-300 hover:bg-white/30"
                >
                  My Enrollments
                </Link>
                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-400 group-hover:w-full transition-all duration-300"></div>
              </motion.div>
            </>
          }
        </div>
        {user ? (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-white/50 shadow-lg"
                }
              }}
            />
            {/* Active indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-md"></div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openSignIn()}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2.5 
                     rounded-full font-medium shadow-lg shadow-blue-500/40
                     transition-all duration-300 hover:shadow-blue-500/60"
          >
            Create Account
          </motion.button>
        )}
      </div>

      {/* Mobile Navigation (logic untouched) */}
      <div className="md:hidden flex items-center gap-3 text-gray-700">
        <div className="flex items-center gap-2 text-sm">
          {user &&
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={becomeEducator}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                         text-white font-medium shadow-md shadow-indigo-500/30 text-xs"
              >
                {isEducator ? 'Dashboard' : 'Become Educator'}
              </motion.button>
              <span className="text-gray-400 text-xs">|</span>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link 
                  to="/my-enrollments" 
                  className="px-2 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm 
                           border border-white/30 text-gray-700 font-medium text-xs"
                >
                  Enrollments
                </Link>
              </motion.div>
            </>
          }
        </div>
        {user ? (
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 border-2 border-white/50 shadow-md"
                }
              }}
            />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white shadow-sm"></div>
          </motion.div>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => openSignIn()}
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 
                     shadow-md shadow-blue-500/30"
          >
            <img src={assets.user_icon} alt="User icon" className="w-5 h-5 filter brightness-0 invert" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Navbar;