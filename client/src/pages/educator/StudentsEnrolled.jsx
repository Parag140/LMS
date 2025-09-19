import React, { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading"; // Assuming you have the cool virtual loading component
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const StudentsEnrolled = () => {
  // --- CORE LOGIC - UNCHANGED ---
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch data.");
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);
  // --- END OF CORE LOGIC ---

  // Framer Motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Each row animates in with a slight delay
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  if (enrolledStudents === null) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-gray-300 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Enrolled Students</h1>
          <p className="text-gray-400 mt-1">
            Live feed of recent course enrollments.
          </p>
        </div>

        {/* Table Container with Glassmorphism Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }}
          className="bg-slate-900/50 backdrop-blur-sm border border-cyan-400/20 rounded-xl overflow-hidden shadow-2xl shadow-black/30"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 text-sm text-left border-b border-cyan-400/20">
                <tr>
                  <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase text-center hidden sm:table-cell">
                    ID
                  </th>
                  <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase">
                    Student
                  </th>
                  <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase">
                    Course Title
                  </th>
                  <th className="p-4 font-semibold text-cyan-400 tracking-wider uppercase hidden sm:table-cell">
                    Purchase Date
                  </th>
                </tr>
              </thead>
              <motion.tbody
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {enrolledStudents.length > 0 ? (
                    enrolledStudents.map((item, index) => (
                      <motion.tr
                        key={item._id || index} // Use a unique ID from the data if available
                        variants={itemVariants}
                        className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors duration-200 group"
                      >
                        <td className="p-4 align-middle text-center text-gray-500 hidden sm:table-cell">
                          {index + 1}
                        </td>
                        <td className="p-4 align-middle flex items-center space-x-4">
                          <img
                            src={item.student.imageUrl}
                            alt={`${item.student.name}'s avatar`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 group-hover:border-cyan-400 transition-colors"
                          />
                          <span className="font-medium text-white truncate">
                            {item.student.name}
                          </span>
                        </td>
                        <td className="p-4 align-middle truncate">
                          {item.courseTitle}
                        </td>
                        <td className="p-4 align-middle text-gray-400 hidden sm:table-cell">
                          {new Date(item.purchaseDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr variants={itemVariants}>
                      <td colSpan="4" className="text-center p-8 text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
                          <span>No students have enrolled yet.</span>
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
    </div>
  );
};

export default StudentsEnrolled;