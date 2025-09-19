import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../../assets/assets";

const Educator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="text-gray-100 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Navbar */}
      <Navbar>
        {/* Sidebar Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-4 p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/60 transition border border-slate-500/30 shadow-md"
        >
          {sidebarOpen ? (
            <img src={assets.cross_icon} alt="close" className="w-5 h-5" />
          ) : (
            <img src={assets.menu_icon} alt="menu" className="w-5 h-5" />
          )}
        </button>
      </Navbar>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Animated Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-64 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700/50 shadow-xl relative z-20"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Outlet Page */}
        <div className="flex-1 px-4 py-6 md:px-8 overflow-y-auto relative z-10">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Educator;