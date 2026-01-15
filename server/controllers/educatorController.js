import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

// ===============================UPDATE ROLE TO EDUCATOR===============================//
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

// ===============================ADD NEW COURSE===============================//
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    const { userId: educatorId } = req.auth();

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Thumbnail Not Attached",
      });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    // Upload image
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    await Course.create(parsedCourseData);

    res.json({
      success: true,
      message: "Course Added",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// ===============================GET EDUCATOR COURSES===============================//
export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const courses = await Course.find({ educator: userId });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================EDUCATOR DASHBOARD DATA =============================== //
export const educatorDashboardData = async (req, res) => {
  try {
    const { userId } = req.auth();

    // 1. Get educator courses
    const courses = await Course.find({ educator: userId });
    const totalCourses = courses.length;

    // 2. Extract course IDs
    const courseIds = courses.map((course) => course._id);

    // 3. Get completed purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    // 4. Calculate earnings
    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // 5. Enrolled students with course titles
    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const { userId: educator } = req.auth();

    // 1. Get educator courses
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    // 2. Get completed purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    // 3. Format data
    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
