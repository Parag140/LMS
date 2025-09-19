import React from 'react'
import { assets } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { user } = useUser(); 

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between 
      px-4 md:px-8 py-3 
      bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10
      backdrop-blur-xl
      border-b border-white/20
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      rounded-b-xl
      mx-2 mt-2">
      
      {/* Logo with 3D hover effect */}
      <Link 
        to='/' 
        className="transform transition-all duration-500 hover:scale-110 hover:-translate-y-1"
      >
        <div className="relative">
          <img 
            src={assets.logo} 
            alt="logo" 
            className="w-28 lg:w-32 drop-shadow-[0_5px_15px_rgba(255,255,255,0.3)] 
                     transition-all duration-500 hover:drop-shadow-[0_10px_25px_rgba(255,255,255,0.5)]" 
          />
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 
                         rounded-lg blur-sm opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      {/* User Section with virtual elements */}
      <div className="flex items-center gap-5 relative">
        {/* Floating text with glow */}
        <p className="font-medium text-sm sm:text-base text-white/90 
                     bg-gradient-to-r from-white/10 to-white/5 
                     px-4 py-2 rounded-full 
                     border border-white/20
                     shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]
                     backdrop-blur-sm
                     transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          👋 Hi, {user ? user.fullName : 'Developer'}
        </p>
        
        {/* 3D Profile Container */}
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 
                         rounded-full blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
          
          {/* Profile container with 3D effect */}
          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 
                         rounded-full p-0.5
                         shadow-[0_5px_15px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.1)]
                         transition-all duration-300 
                         group-hover:shadow-[0_8px_25px_rgba(100,100,255,0.4),inset_0_3px_6px_rgba(255,255,255,0.2)]
                         group-hover:-translate-y-0.5">
            {user ? (
              <div className="transform transition-all duration-300 group-hover:scale-105">
                <UserButton />
              </div>
            ) : (
              <img 
                src={assets.profile_img} 
                alt="profile" 
                className="w-9 h-9 rounded-full transition-all duration-300 group-hover:scale-110" 
              />
            )}
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-400 rounded-full 
                         opacity-0 group-hover:opacity-100 
                         animate-ping"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-indigo-400 rounded-full 
                         opacity-0 group-hover:opacity-100 
                         animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar