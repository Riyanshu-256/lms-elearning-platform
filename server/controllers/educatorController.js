import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

/* ================= UPDATE ROLE ================= */
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.role === "educator") {
      return res.json({
        success: false,
        message: "You are already an educator",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: "educator" },
    });

    res.json({
      success: true,
      message: "Role updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADD COURSE ================= */
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const { userId: educatorId } = req.auth();

    /* AUTH CHECK */
    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    /* VALIDATION */
    if (!courseData) {
      return res.status(400).json({
        success: false,
        message: "Course data missing",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail is required",
      });
    }

    /* PARSE DATA */
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid course data format",
      });
    }

    const {
      courseTitle,
      courseDescription,
      coursePrice,
      discount,
      courseContent,
    } = parsedCourseData;

    if (!courseTitle || !courseDescription) {
      return res.status(400).json({
        success: false,
        message: "Title & description required",
      });
    }

    parsedCourseData.educator = educatorId;

    /* UPLOAD THUMBNAIL */
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "lms_courses",
    });

    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    /* REMOVE TEMP FILE */
    fs.unlinkSync(imageFile.path);

    /* SAVE TO DB */
    const newCourse = await Course.create(parsedCourseData);

    res.status(201).json({
      success: true,
      message: "Course Added Successfully",
      course: newCourse,
    });
  } catch (error) {
    console.log("ADD COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET EDUCATOR COURSES ================= */
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const courses = await Course.find({ educator: userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DASHBOARD ================= */
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const courses = await Course.find({ educator: userId });
    const totalCourses = courses.length;

    const courseIds = courses.map((c) => c._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    /* OPTIMIZED STUDENT FETCH */
    const enrolledStudentsData = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const formatted = enrolledStudentsData.map((p) => ({
      courseTitle: p.courseId.courseTitle,
      student: p.userId,
    }));

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData: formatted,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ENROLLED STUDENTS ================= */
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId: educator } = req.auth();

    const courses = await Course.find({ educator });
    const courseIds = courses.map((c) => c._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((p) => ({
      student: p.userId,
      courseTitle: p.courseId.courseTitle,
      purchaseDate: p.createdAt,
    }));

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
