import Course from "../models/Course.js";

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
    .select(["-courseConent", "-enrolledStudents"])// '-courseConent' means exclude courseContent from the returned documents
    .populate({path:'educator'}); // populate educator ka data in the returned documents
        res.json({ success: true, courses });
    } catch (error) {
        res.json({success:false, message: "Error while fetching courses", error: error.message });
    }
};

//get course by id  of educators

export const getCourseById = async(req,res) =>{
    const {id} = req.params;
    try {
        const courseData = await Course.findById(id).populate({path:'educator'});
        //remove lectureUrl if is PreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl = ""; // agar koi lecture free nahi hain to unhka url hataa do
                }
            })
        })
        res.json({success:true, courseData});
    } catch (error) {
        res.json({success:false, message: "Error while fetching course", error: error.message });
    }
}
