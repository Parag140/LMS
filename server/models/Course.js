import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
  lectureId: { type: String, required: true }, // lecture ki id
  lectureTitle: { type: String, required: true }, // lecture ka title
  lectureDuration: { type: Number, required: true }, // lecture ka duration in seconds
  lectureUrl: { type: String, required: true }, // lecture ka url
  isPreviewFree: { type: Boolean, required: true }, // preview free or not
  lectureOrder: { type: Number, required: true }, // lecture ki order
}, { _id: false });

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true }, // chapter ki id
  chapterOrder: { type: Number, required: true }, // chapter ki order
  chapterTitle: { type: String, required: true },// chapter ka title
  chapterContent: [lectureSchema] // chapter ka content
}, { _id: false }); // id false ka matlab hai currently koi chapter id nhi hai


const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true }, //course ka naam
  courseDescription: { type: String, required: true }, // course ka description
  courseThumbnail: { type: String }, // course thumbnail
  coursePrice: { type: Number, required: true }, // course price
  isPublished: { type: Boolean, default: true }, // course published or not
  discount: { type: Number, required: true, min: 0, max: 100 },// discount percentage
  courseContent: [chapterSchema], // course ka content
  courseRatings: [
    { userId: { type: String }, rating: { type: Number, min: 1, max: 5 } }, // course ka rating kis user ne kitni rating di hai
  ],
  educator: { type: String, ref: "User", required: true }, // course ka educator ki id
  enrolledStudents: [{ type: String, ref: "User" }], // course ka enrolled students ki id
    
},{timestamps: true,minimize: false}); // minimize ka matlab hai schema

const Course = mongoose.model("Course", courseSchema);

export default Course;
