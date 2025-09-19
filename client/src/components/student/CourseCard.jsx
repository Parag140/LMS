import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);
  
  return (
    <Link
      to={'/course/' + course._id}
      onClick={() => scrollTo(0, 0)}
      className="group relative block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 border border-gray-100"
    >
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden aspect-video">
        <img 
          src={course.courseThumbnail} 
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge */}
        {course.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{course.discount}%
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {course.courseTitle}
        </h3>
        
        {/* Educator */}
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
          {course.educator.name}
        </p>
        
        {/* Rating Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="font-bold text-amber-500">
              {calculateRating(course).toFixed(1)}
            </span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(course))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-4 h-4 drop-shadow-sm"
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            ({course.courseRatings.length} reviews)
          </span>
        </div>
        
        {/* Price Section */}
        <div className="flex items-center gap-3 pt-2">
          <p className="text-2xl font-bold text-gray-900">
            {currency}{(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
          {course.discount > 0 && (
            <p className="text-sm text-gray-500 line-through">
              {currency}{course.coursePrice.toFixed(2)}
            </p>
          )}
        </div>
        
        {/* Hover Action */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-transparent h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>
      
      {/* Floating Action on Hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
          <span className="text-blue-600 font-semibold">View Course →</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;