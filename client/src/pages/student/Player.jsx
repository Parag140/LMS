import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Components for a Cleaner & More Virtual UI ---

// Animated progress bar for overall course completion
const CourseProgress = ({ progressData, courseData }) => {
  const totalLectures = courseData.courseContent.reduce((acc, chapter) => acc + chapter.chapterContent.length, 0);
  const completedLectures = progressData?.lectureCompleted.length || 0;
  const percent = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-400/20">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="font-semibold text-gray-300">Course Progress</span>
        <span className="font-bold text-cyan-400">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

// The redesigned, animated accordion for the syllabus
const AccordionItem = ({ chapter, lectures, isOpen, onToggle, onSelectLecture, progressData, calculateChapterTime }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg mb-3 overflow-hidden">
      <button className="w-full flex items-center justify-between px-4 py-3 text-left" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </motion.div>
          <p className="font-semibold text-gray-200">{chapter.chapterTitle}</p>
        </div>
        <p className="text-sm text-gray-400 hidden sm:block">{calculateChapterTime(chapter)}</p>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <ul className="border-t border-slate-700/50">
              {lectures.map((lecture, i) => {
                const isCompleted = progressData?.lectureCompleted.includes(lecture.lectureId);
                return (
                  <li key={i} onClick={() => onSelectLecture(lecture, chapter.chapterOrder, i + 1)} className="flex items-center justify-between py-3 px-4 cursor-pointer hover:bg-cyan-400/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full ${isCompleted ? 'bg-emerald-500' : 'border-2 border-gray-600'}`}>
                        {isCompleted && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                      </div>
                      <p className={`text-sm ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{lecture.lectureTitle}</p>
                    </div>
                    <p className="text-gray-500 text-sm font-mono">{humanizeDuration(lecture.lectureDuration * 60 * 1000, { round: true, largest: 2 })}</p>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// --- Main Player Component ---

const Player = () => {
  // --- CORE LOGIC - UNCHANGED ---
  const [courseData, setCourseData] = useState(null);
  const { calculateChapterTime, backendUrl, getToken, userData, enrolledCourses, fetchUserEnrolledCourses } = useContext(AppContext);
  const [openSections, setOpenSections] = useState({});
  const { courseId } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = () => {
    const currentCourse = enrolledCourses.find((course) => course._id === courseId);
    if (currentCourse) {
      setCourseData(currentCourse);
      const userRating = currentCourse.courseRatings.find(item => item.userId === userData._id);
      if (userRating) {
        setInitialRating(userRating.rating);
      }
    }
  };
  
  const toggleSection = (index) => setOpenSections(prev => ({...prev, [index]: !prev[index]}));

  useEffect(() => {
    if (enrolledCourses.length > 0 && userData) getCourseData();
  }, [enrolledCourses, userData]);
  
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/user/update-course-progress`, { courseId, lectureId }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        getCourseProgress(); // Re-fetch progress to update UI instantly
      } else { toast.error(data.message); }
    } catch (error) { toast.error(error.response?.data?.message || "Action failed."); }
  };
  
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) { setProgressData(data.progressData); } 
      else { toast.error(data.message); }
    } catch (error) { toast.error(error.response?.data?.message || "Failed to get progress."); }
  };
  
  const getYouTubeId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/user/add-rating`, { courseId, rating }, { headers: { Authorization: `Bearer ${token}` } });
      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else { toast.error(data.message); }
    } catch (error) { toast.error(error.response?.data?.message || "Rating failed."); }
  };

  useEffect(() => {
    if (courseId) getCourseProgress();
  }, [courseId]);
  // --- END OF CORE LOGIC ---

  const handleSelectLecture = (lecture, chapterOrder, lectureOrder) => {
    setPlayerData({ ...lecture, chapterOrder, lectureOrder });
  };
  
  if (!courseData) return <Loading />;

  const isLectureCompleted = playerData && progressData?.lectureCompleted.includes(playerData.lectureId);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white">
        <div className="grid grid-cols-1 md:grid-cols-5 xl:grid-cols-4 gap-8 p-4 sm:p-6 lg:p-8">
          
          {/* Right Column: Video Player */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 xl:col-span-3 sticky top-24 self-start"
          >
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-cyan-400/20 shadow-2xl shadow-cyan-500/10">
              <AnimatePresence mode="wait">
                {playerData ? (
                  <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <YouTube videoId={getYouTubeId(playerData.lectureUrl)} iframeClassName="w-full aspect-video" />
                  </motion.div>
                ) : (
                  <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-cover bg-center" style={{ backgroundImage: `url(${courseData.courseThumbnail})` }}>
                     <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                     <div className="relative z-10">
                        <h2 className="text-3xl font-bold">{courseData.courseTitle}</h2>
                        <p className="mt-2 text-gray-400">Select a lecture from the syllabus to begin learning.</p>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {playerData && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4">
                  <div>
                    <p className="font-semibold text-lg text-gray-200">{playerData.lectureTitle}</p>
                    <p className="text-sm text-gray-500">Chapter {playerData.chapterOrder} - Lecture {playerData.lectureOrder}</p>
                  </div>
                  <motion.button
                    onClick={() => markLectureAsCompleted(playerData.lectureId)}
                    disabled={isLectureCompleted}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isLectureCompleted ? 'bg-emerald-500/20 text-emerald-400 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                    whileTap={{ scale: isLectureCompleted ? 1 : 0.95 }}
                  >
                    {isLectureCompleted ? (
                      <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Completed</>
                    ) : (
                      "Mark as Complete"
                    )}
                  </motion.button>
              </div>
            )}
          </motion.div>
          
          {/* Left Column: Syllabus & Controls */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="md:col-span-2 xl:col-span-1 flex flex-col gap-6"
          >
            <h2 className="text-2xl font-bold text-white">Course Syllabus</h2>
            <CourseProgress progressData={progressData} courseData={courseData} />
            <div className="max-h-[50vh] overflow-y-auto pr-2">
              {courseData.courseContent.map((chapter, index) => (
                <AccordionItem
                  key={index}
                  chapter={chapter}
                  lectures={chapter.chapterContent}
                  isOpen={!!openSections[index]}
                  onToggle={() => toggleSection(index)}
                  onSelectLecture={handleSelectLecture}
                  progressData={progressData}
                  calculateChapterTime={calculateChapterTime}
                />
              ))}
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-cyan-400/20">
                <h3 className="font-semibold text-center mb-3">Enjoying the course?</h3>
                <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          </motion.div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;