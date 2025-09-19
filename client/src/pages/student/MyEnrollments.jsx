import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

// A reusable, animated progress bar component
const VirtualProgressBar = ({ percent }) => {
  return (
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  );
};

const MyEnrollments = () => {
  // --- CORE LOGIC - UNCHANGED ---
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get progress.");
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);
  // --- END OF CORE LOGIC ---

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold tracking-tight">My Learning Path</h1>
            <p className="text-gray-400 mt-2">
              Continue your journey and master new skills.
            </p>
          </motion.div>

          {/* Enrollments Grid */}
          {enrolledCourses.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {enrolledCourses.map((course, index) => {
                const progress = progressArray[index];
                const totalLectures = progress?.totalLectures || 1; // Avoid division by zero
                const lecturesCompleted = progress?.lectureCompleted || 0;
                const progressPercent = Math.round((lecturesCompleted / totalLectures) * 100);

                return (
                  <motion.div
                    key={course._id}
                    variants={itemVariants}
                    transition={{ type: "spring", stiffness: 100 }}
                    whileHover={{ y: -8, scale: 1.03 }}
                    className="group bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-xl overflow-hidden shadow-2xl shadow-black/30 flex flex-col cursor-pointer"
                    onClick={() => navigate("/player/" + course._id)}
                  >
                    {/* Course Thumbnail */}
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>

                    {/* Course Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-lg font-semibold text-white mb-4 flex-grow line-clamp-2">
                        {course.courseTitle}
                      </h2>
                      
                      {/* Progress Section */}
                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400 font-mono">
                            {lecturesCompleted} / {totalLectures} Lectures
                          </span>
                          <span className="font-semibold text-cyan-400">
                            {progressPercent}%
                          </span>
                        </div>
                        <VirtualProgressBar percent={progressPercent} />
                      </div>

                      {/* Action Button */}
                      <button className="mt-auto w-full py-3 rounded-lg text-center font-semibold bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 transform group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                        {progressPercent === 100 ? "Review Course" : "Continue Learning"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
             <div className="text-center py-20">
                <h2 className="text-2xl text-gray-400">Your learning path is empty.</h2>
                <p className="text-gray-500 mt-2">Enroll in a course to begin your journey!</p>
             </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;