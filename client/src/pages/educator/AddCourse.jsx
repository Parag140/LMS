import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// --- Sub-components for better organization ---

// Chapter UI Component
const ChapterItem = ({ chapter, index, handlers }) => {
  const { handleChapter, handleLecture } = handlers;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/50 border border-cyan-400/20 rounded-lg mb-4"
    >
      <div className="flex justify-between items-center p-4 border-b border-cyan-400/20">
        <div className="flex items-center gap-3">
          <motion.div
            onClick={() => handleChapter("toggle", chapter.chapterId)}
            className="cursor-pointer text-cyan-400"
            animate={{ rotate: chapter.collapsed ? -90 : 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </motion.div>
          <span className="font-semibold text-gray-200">
            Chapter {index + 1}: {chapter.chapterTitle}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {chapter.chapterContent.length} Lectures
          </span>
          <button type="button" onClick={() => handleChapter("remove", chapter.chapterId)} className="text-red-500 hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {!chapter.collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <AnimatePresence>
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <motion.div
                    layout
                    key={lecture.lectureId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, transition: {duration: 0.2} }}
                    className="flex justify-between items-center bg-slate-900/50 p-2 rounded"
                  >
                    <div className="flex items-center gap-3 text-gray-300">
                      <span>{lectureIndex + 1}. {lecture.lectureTitle}</span>
                      <span className="text-gray-500 text-sm">({lecture.lectureDuration}m)</span>
                      {lecture.isPreviewFree && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Free Preview</span>}
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={lecture.lectureUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
                        </a>
                        <button type="button" onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)} className="text-red-500 hover:text-red-400">
                           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-cyan-400 p-2 rounded transition-colors"
                onClick={() => handleLecture("add", chapter.chapterId)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                Add Lecture
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Lecture Popup Component
const LecturePopup = ({ details, setDetails, onAdd, onClose }) => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 text-gray-300 p-6 rounded-lg relative w-full max-w-md border border-cyan-400/30 shadow-2xl shadow-cyan-500/10"
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Add New Lecture</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Lecture Title</label>
              <input type="text" className="form-input-dark" value={details.lectureTitle} onChange={e => setDetails({ ...details, lectureTitle: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-400">Duration (minutes)</label>
              <input type="number" className="form-input-dark" value={details.lectureDuration} onChange={e => setDetails({ ...details, lectureDuration: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-400">Lecture URL (e.g., YouTube, Vimeo)</label>
              <input type="text" className="form-input-dark" value={details.lectureUrl} onChange={e => setDetails({ ...details, lectureUrl: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input id="isFree" type="checkbox" className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-cyan-500 focus:ring-cyan-600" checked={details.isPreviewFree} onChange={e => setDetails({ ...details, isPreviewFree: e.target.checked })} />
              <label htmlFor="isFree" className="text-gray-300">Make this lecture a free preview</label>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" className="px-4 py-2 rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 transition" onClick={onClose}>Cancel</button>
            <button type="button" className="px-6 py-2 rounded-md text-white bg-cyan-600 hover:bg-cyan-500 transition" onClick={onAdd}>Add Lecture</button>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </motion.div>
      </motion.div>
    );
  };


// Main AddCourse Component
const AddCourse = () => {
  // --- CORE LOGIC - UNCHANGED ---
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const { backendUrl, getToken } = useContext(AppContext);
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? Math.max(...chapters.map(c => c.chapterOrder)) + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const newContent = [...chapter.chapterContent];
            newContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: newContent };
          }
          return chapter;
        })
      );
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
      toast.error("Please fill all lecture details");
      return;
    }
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 ? Math.max(...chapter.chapterContent.map(l => l.lectureOrder)) + 1 : 1,
            lectureId: uniqid(),
          };
          return { ...chapter, chapterContent: [...chapter.chapterContent, newLecture] };
        }
        return chapter;
      })
    );
    setShowPopup(false);
    setLectureDetails({ lectureTitle: "", lectureDuration: "", lectureUrl: "", isPreviewFree: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please select a course thumbnail");
    if (chapters.length === 0) return toast.error("Please add at least one chapter");

    try {
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);
      const token = await getToken();

      const { data } = await axios.post(`${backendUrl}/api/educator/add-course`, formData, { headers: { Authorization: `Bearer ${token}` } });
      
      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice("");
        setDiscount("");
        setImage(null);
        setChapters([]);
        if (quillRef.current) quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: { toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image'],
            ['clean']
        ]},
        placeholder: 'Describe what this course is about...'
      });
    }
  }, []);
  // --- END OF CORE LOGIC ---


  return (
    <>
      {/* Custom CSS for Quill Dark Theme */}
      <style>{`
        .ql-editor { color: #d1d5db; }
        .ql-snow .ql-stroke { stroke: #9ca3af; }
        .ql-snow .ql-picker-label { color: #9ca3af; }
        .ql-snow .ql-picker-options { background-color: #1f2937; border-color: #4b5563; }
        .ql-snow .ql-picker-item:hover { color: #60a5fa; }
        .ql-toolbar.ql-snow { border-color: #4b5563; border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
        .ql-container.ql-snow { border-color: #4b5563; border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
        .form-input-dark {
          margin-top: 0.25rem;
          display: block;
          width: 100%;
          border-radius: 0.375rem;
          background-color: #1f2937;
          border: 1px solid #4b5563;
          padding: 0.5rem 0.75rem;
          color: #d1d5db;
          outline: none;
        }
        .form-input-dark:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 2px #3b82f680;
        }
      `}</style>
      
      <div className="min-h-screen bg-slate-900 text-gray-300 p-4 sm:p-6 lg:p-8">
        <form className="grid grid-cols-1 lg:grid-cols-2 gap-8" onSubmit={handleSubmit}>
          
          {/* Left Column: Course Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-cyan-400/20 pb-2">Course Details</h2>
            <div>
              <label className="text-sm font-medium text-gray-400">Course Title</label>
              <input onChange={e => setCourseTitle(e.target.value)} value={courseTitle} type="text" placeholder="e.g., The Ultimate Web Development Bootcamp" className="form-input-dark" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">Course Description</label>
              <div ref={editorRef} className="mt-1 h-48"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-400">Course Price ($)</label>
                <input type="number" onChange={e => setCoursePrice(e.target.value)} value={coursePrice} placeholder="e.g., 99.99" className="form-input-dark" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Discount (%)</label>
                <input onChange={e => setDiscount(e.target.value)} value={discount} type="number" placeholder="e.g., 20" min={0} max={100} className="form-input-dark" required />
              </div>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400">Course Thumbnail</label>
                <label htmlFor="thumbnailImage" className="mt-1 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-cyan-400/30 border-dashed rounded-md cursor-pointer hover:border-cyan-400/60 transition-colors">
                    <div className="space-y-1 text-center">
                        {image ? (
                             <img src={URL.createObjectURL(image)} alt="Thumbnail Preview" className="mx-auto h-24 object-contain" />
                        ) : (
                            <>
                                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <p className="text-sm text-gray-400">Drag & drop or <span className="text-cyan-400">click to upload</span></p>
                            </>
                        )}
                    </div>
                </label>
                <input type="file" id="thumbnailImage" onChange={e => setImage(e.target.files[0])} accept="image/*" className="sr-only" />
            </div>
          </div>

          {/* Right Column: Curriculum */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-cyan-400/20 pb-2">Curriculum Builder</h2>
            <div className="space-y-4">
                <AnimatePresence>
                    {chapters.map((chapter, index) => (
                        <ChapterItem key={chapter.chapterId} chapter={chapter} index={index} handlers={{ handleChapter, handleLecture }} />
                    ))}
                </AnimatePresence>
            </div>
            <button type="button" onClick={() => handleChapter("add")} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/50 text-cyan-400 p-3 rounded-lg border border-cyan-400/20 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add New Chapter
            </button>
          </div>

          {/* Form Submission Button */}
          <div className="lg:col-span-2 flex justify-end pt-4">
             <button type="submit" className="px-10 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-1">
                Create Course
            </button>
          </div>

        </form>
      </div>

      {/* Lecture Popup Modal */}
      <AnimatePresence>
        {showPopup && (
          <LecturePopup
            details={lectureDetails}
            setDetails={setLectureDetails}
            onAdd={addLecture}
            onClose={() => setShowPopup(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AddCourse;