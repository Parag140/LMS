import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading"; // Assuming you have the cool virtual loading component
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const MyCourses = () => {
  // --- CORE LOGIC - UNCHANGED ---
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses.reverse()); // Show newest courses first
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses.");
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);
  // --- END OF CORE LOGIC ---

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Each row animates in with a slight delay
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  if (courses === null) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Courses</h1>
        <p className="text-gray-400 mt-1">
          Manage and track the performance of your published courses.
        </p>
      </div>

      {/* Table Container with Glassmorphism Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
        className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-xl overflow-hidden shadow-2xl shadow-black/30"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 text-sm text-left border-b border-cyan-400/20">
              <tr>
                <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase">
                  Course
                </th>
                <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase text-center">
                  Earnings
                </th>
                <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase text-center">
                  Students
                </th>
                <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase hidden md:table-cell">
                  Published On
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <motion.tr
                      key={course._id}
                      layout
                      variants={itemVariants}
                      className="border-b border-slate-800 hover:bg-slate-800/70 transition-colors duration-200 group"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center space-x-4">
                          <img
                            src={course.courseThumbnail}
                            alt={course.courseTitle}
                            className="w-12 h-12 object-cover rounded-md border-2 border-slate-600 group-hover:border-cyan-400 transition-colors"
                          />
                          <span className="font-medium text-white truncate max-w-xs">
                            {course.courseTitle}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-center font-mono text-emerald-400 text-base">
                        {currency}
                        {(
                          course.enrolledStudents.length *
                          (course.coursePrice - (course.discount * course.coursePrice) / 100)
                        ).toFixed(2)}
                      </td>
                      <td className="p-4 align-middle text-center font-mono text-white text-base">
                        {course.enrolledStudents.length}
                      </td>
                      <td className="p-4 align-middle text-gray-400 hidden md:table-cell">
                        {new Date(course.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr variants={itemVariants}>
                    <td colSpan="4" className="text-center p-12 text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        <span className="font-medium">No courses found.</span>
                        <p>Create your first course to see it here.</p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MyCourses;