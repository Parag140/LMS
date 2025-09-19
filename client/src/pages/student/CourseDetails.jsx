import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Components for a Cleaner UI ---

// A reusable, animated star rating component
const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    <span className="font-bold text-amber-400 mr-1">{rating.toFixed(1)}</span>
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

// An animated, stylish accordion for the course content
const AccordionItem = ({ chapter, isOpen, onToggle, onPreview, calculateChapterTime }) => {
  return (
    <div className="bg-slate-800/50 border border-cyan-400/20 rounded-lg mb-3 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </motion.div>
          <p className="font-semibold text-gray-200">{chapter.chapterTitle}</p>
        </div>
        <p className="text-sm text-gray-400 hidden sm:block">
          {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
        </p>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <ul className="px-5 py-2 border-t border-cyan-400/20">
              {chapter?.chapterContent?.map((lecture, i) => (
                <li key={i} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="text-gray-300 text-sm">{lecture.lectureTitle}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {lecture.isPreviewFree && (
                      <button onClick={() => onPreview(lecture.lectureUrl)} className="font-semibold text-cyan-400 hover:text-cyan-300">
                        Preview
                      </button>
                    )}
                    <p className="text-gray-500 font-mono">
                      {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ["h", "m"], round: true })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Main CourseDetails Component ---
const CourseDetails = () => {
  // --- CORE LOGIC - UNCHANGED ---
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency, backendUrl,
    userData, getToken
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch course data.");
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) return toast.warn("Please log in to enroll.");
      if (isAlreadyEnrolled) return navigate(`/player/${courseData._id}`);
      
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/user/purchase`, { courseId: courseData._id }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourseData();
  }, [id]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const handlePreview = (url) => {
    setPlayerData({ videoId: url.split("/").pop() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // --- END OF CORE LOGIC ---

  if (!courseData) return <Loading />;

  const finalPrice = (courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2);

  return (
    <>
      <style>{`
        .prose-dark { color: #d1d5db; }
        .prose-dark h1, .prose-dark h2, .prose-dark h3 { color: #fff; border-bottom-color: #374151; }
        .prose-dark p, .prose-dark li { color: #9ca3af; }
        .prose-dark a { color: #60a5fa; }
        .prose-dark strong { color: #e5e7eb; }
        .prose-dark ul > li::before { background-color: #4b5563; }
      `}</style>

      <div className="bg-slate-900 text-white">
        {/* --- Hero Section --- */}
        <div className="relative bg-black">
          <div className="absolute inset-0">
            <img src={courseData.courseThumbnail} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl"
            >
              {courseData.courseTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg text-gray-300 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) + '...' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-6 text-sm"
            >
              <StarRating rating={calculateRating(courseData)} />
              <span className="text-gray-400">({courseData.courseRatings.length} ratings)</span>
              <span className="text-gray-300">{courseData.enrolledStudents.length} students</span>
              <span className="text-gray-400">Created by <span className="text-cyan-400 font-semibold">{courseData.educator.name}</span></span>
            </motion.div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div>
                {courseData.courseContent.map((chapter, index) => (
                  <AccordionItem
                    key={index}
                    chapter={chapter}
                    isOpen={!!openSections[index]}
                    onToggle={() => toggleSection(index)}
                    onPreview={handlePreview}
                    calculateChapterTime={calculateChapterTime}
                  />
                ))}
              </div>

              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Description</h3>
                <div
                  className="prose-dark max-w-none"
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                />
              </div>
            </div>

            {/* Right Column (Sticky Purchase Card) */}
            <div className="lg:sticky top-24 self-start">
              <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-400/20 rounded-xl overflow-hidden shadow-2xl shadow-black/30">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={playerData ? 'player' : 'thumbnail'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {playerData ? (
                      <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName="w-full aspect-video" />
                    ) : (
                      <img src={courseData.courseThumbnail} alt="" className="w-full aspect-video object-cover" />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="p-6 space-y-5">
                    <div className="flex items-baseline gap-3">
                        <p className="text-4xl font-bold text-white">{currency}{finalPrice}</p>
                        {courseData.discount > 0 && <>
                          <p className="text-lg text-gray-500 line-through">{currency}{courseData.coursePrice}</p>
                          <p className="text-sm font-semibold bg-purple-600 text-white px-2 py-0.5 rounded-full">{courseData.discount}% OFF</p>
                        </>}
                    </div>
                    {courseData.discount > 0 && <p className="text-sm text-red-400">5 days left at this price!</p>}
                    <button onClick={enrollCourse} className="w-full py-3 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 transform hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1">
                        {isAlreadyEnrolled ? "Go to Course" : "Enroll Now"}
                    </button>
                    <div className="border-t border-slate-700/50 pt-5">
                      <h4 className="font-semibold mb-3 text-gray-200">This course includes:</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span>{calculateCourseDuration(courseData)} of on-demand video</span></li>
                        <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg><span>Downloadable resources & code</span></li>
                        <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg><span>Access on mobile and TV</span></li>
                        <li className="flex items-center gap-3"><svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg><span>Certificate of completion</span></li>
                      </ul>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;