import { clerkClient } from "@clerk/express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/purchase.js";

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "you can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// add new course

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth().userId;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a course thumbnail" });
    }

    // --- Step 1: Upload the image to Cloudinary FIRST ---
    // This is the most likely point of failure. If it fails, we haven't touched our database.
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "course_thumbnails", // Good practice: organize uploads
    });

    // Check if the upload was successful and we got a URL
    if (!imageUpload || !imageUpload.secure_url) {
        throw new Error("Cloudinary image upload failed. Please try again.");
    }
    
    // --- Step 2: Prepare all data for the database ---
    const parsedCourseData = JSON.parse(courseData); // No need for await here
    
    // Add the educator ID and the successfully uploaded image URL
    parsedCourseData.educator = educatorId;
    parsedCourseData.courseThumbnail = imageUpload.secure_url; 

    // --- Step 3: Create the course in a single, atomic operation ---
    // Now we create the course with ALL the required data at once.
    const newCourse = await Course.create(parsedCourseData);

    // Use 201 status for "Created"
    res.status(201).json({
      success: true,
      message: "Course created successfully!",
      course: newCourse, // Use lowercase 'c' for consistency
    });

  } catch (error) {
    // Provide a more informative error message
    console.error("Error in addCourse:", error); // Log the full error on the server
    res.status(500).json({
      success: false,
      message: "Error creating course. See server logs for details.",
      error: error.message,
    });
  }
};

//get educator courses

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator: educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({
      success: false,
      message: "error aa raha hai",
      message: error.message, //-----------------------------------------------------//
    });
  }
};

// get educator dashboard data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (total, purchase) => total + purchase.amount,
      0
    );

    const enrolledStudents = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );
      students.forEach((student) =>
        enrolledStudents.push({ courseTitle: course.courseTitle, student })
      );
    }

    res.json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudents, totalCourses },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get enrolled students data with purchased data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth().userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));
    res.json({ success: true, enrolledStudents , message:"successfull get enrolled users"});

  } catch (error) {
    res.json({ success: false, message: error.message });
    
  }
}