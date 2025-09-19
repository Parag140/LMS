import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";

const DashBoard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  const statsCards = [
    {
      icon: assets.patients_icon,
      value: dashboardData?.enrolledStudents.length,
      label: "Total Students Enrolled",
      from: "from-blue-500",
      to: "to-cyan-400",
      glow: "shadow-blue-500/40"
    },
    {
      icon: assets.earning_icon,
      value: `${currency}${dashboardData?.totalEarnings}`,
      label: "Total Earnings",
      from: "from-green-500",
      to: "to-emerald-400",
      glow: "shadow-green-500/40"
    },
    {
      icon: assets.appointments_icon,
      value: dashboardData?.totalCourses,
      label: "Total Courses",
      from: "from-purple-500",
      to: "to-pink-400",
      glow: "shadow-purple-500/40"
    },
  ];

  return dashboardData ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        {/* Stats Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              className={`relative flex items-center gap-4 p-6 rounded-xl border border-white/10
                          bg-white/5 backdrop-blur-xl shadow-lg ${stat.glow}
                          transition-all duration-300`}
            >
              {/* Gradient bar accent */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.from} ${stat.to} opacity-10`} />

              {/* Icon */}
              <div className="p-3 bg-white/10 rounded-lg relative z-10">
                <img src={stat.icon} alt="icon" className="w-8 h-8" />
              </div>

              {/* Value + Label */}
              <div className="relative z-10">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enrollments */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <h2 className="text-lg md:text-xl font-semibold text-gray-100">Latest Enrollments</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 text-gray-300 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left hidden sm:table-cell">#</th>
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-left">Course</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData?.enrolledStudentsData?.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-blue-500/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs text-gray-400 hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.student.imageUrl}
                          alt="Profile"
                          className="w-10 h-10 rounded-full border border-blue-400/40 shadow-md shadow-blue-500/30"
                        />
                        <span className="text-sm font-medium">{item.student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 truncate">
                      {item.courseTitle}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  ) : (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default DashBoard;