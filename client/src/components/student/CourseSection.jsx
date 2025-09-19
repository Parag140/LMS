import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import { motion } from "framer-motion";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="py-16 md:px-40 px-8 relative overflow-hidden from-cyan-100/70 to-blue-100/50"
    >
      {/* Animated glowing dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', opacity: 0.3 }}
            animate={{ y: [null, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Heading */}
      <motion.h2 className="text-3xl font-bold text-gray-800 relative">
        Learn from the best
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full"
        />
      </motion.h2>

      {/* Description */}
      <motion.p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl leading-relaxed">
        Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
      </motion.p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-6 relative z-10">
        {allCourses.slice(0, 4).map((course, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index, duration: 0.5 }} viewport={{ once: true }}>
            <CourseCard course={course} />
          </motion.div>
        ))}
      </div>

      {/* Show all */}
      <div className="text-center">
        <Link to={"/course-list"} onClick={() => window.scrollTo(0,0)}
          className="inline-block text-gray-700 border border-gray-300 px-8 py-3 rounded-full bg-white/80 backdrop-blur-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-md hover:shadow-lg transition">
          Show All Courses
        </Link>
      </div>
    </motion.div>
  );
};
export default CourseSection;