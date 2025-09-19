import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";
import { motion } from "framer-motion";

const CoursesList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    } else {
      setFilteredCourse(allCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-200 md:px-28 px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Course List
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              <span
                className="text-blue-400 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span className="text-gray-300">Courses</span>
            </p>
          </div>

          {/* Search on the right */}
          <SearchBar data={input} />
        </div>

        {/* Active search tag */}
        {input && (
          <div className="inline-flex items-center gap-3 px-4 py-2 mt-8 rounded-lg bg-white/5 backdrop-blur-lg border border-white/20 text-gray-300">
            <p className="italic">{input}</p>
            <img
              src={assets.cross_icon}
              alt="clear"
              className="w-4 cursor-pointer hover:scale-110"
              onClick={() => {
                navigate("/course-list");
              }}
            />
          </div>
        )}

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-14"
        >
          {filteredCourse?.length > 0 ? (
            filteredCourse.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <p className="text-lg">⚡ No courses found</p>
              <p className="text-sm mt-2">Try adjusting your search.</p>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default CoursesList;