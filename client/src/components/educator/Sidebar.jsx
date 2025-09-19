import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  return (
    isEducator && (
      <div className="md:w-64 w-16 min-h-screen py-4 flex flex-col
                     bg-gradient-to-b from-indigo-900/20 to-purple-900/20
                     backdrop-blur-xl
                     border-r border-white/20
                     shadow-[0_0_50px_rgba(120,119,198,0.3)]">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `group flex items-center md:flex-row flex-col 
               md:justify-start justify-center gap-3 md:px-8 py-4 mx-2 my-1 rounded-xl
               transition-all duration-300 transform
               ${isActive
                 ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 shadow-lg shadow-indigo-500/30 border-r-4 border-indigo-400 scale-105"
                 : "hover:bg-white/10 hover:shadow-md hover:shadow-purple-500/20 border-r-4 border-transparent hover:border-white/20 hover:-translate-y-0.5"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon with glow effect */}
                <div className={`relative p-2 rounded-lg transition-all duration-300 
                                ${isActive 
                                  ? "bg-white/20 shadow-inner shadow-white/50" 
                                  : "bg-black/20 group-hover:bg-white/10"}`}>
                  <img 
                    src={item.icon} 
                    alt="" 
                    className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                  />
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full 
                                   shadow-[0_0_10px_2px_rgba(99,102,241,0.8)]"></div>
                  )}
                </div>
                
                {/* Text with virtual styling */}
                <p className="md:block hidden text-center font-medium text-white/90 
                             bg-gradient-to-r from-white/10 to-transparent 
                             px-4 py-1 rounded-full
                             transition-all duration-300
                             group-hover:text-white group-hover:bg-white/20
                             group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                  {item.name}
                </p>
                
                {/* Hover tooltip for mobile */}
                <div className="md:hidden absolute left-full ml-4 px-3 py-1 
                               bg-gray-900/90 text-white text-sm rounded-lg 
                               opacity-0 group-hover:opacity-100 transition-all duration-300
                               shadow-lg shadow-purple-500/20 backdrop-blur-sm">
                  {item.name}
                </div>
              </>
            )}
          </NavLink>
        ))}
        
        {/* Decorative virtual elements */}
        <div className="mt-auto mx-2 p-3 rounded-lg bg-black/20 border border-white/10 
                       backdrop-blur-sm text-center">
          <p className="text-xs text-white/60 md:block hidden">Educator Portal</p>
          <div className="flex justify-center mt-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full mx-1 animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-1 animate-pulse delay-150"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full mx-1 animate-pulse delay-300"></div>
          </div>
        </div>
      </div>
    )
  );
};

export default Sidebar;