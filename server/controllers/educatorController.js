import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";

// Update role to educator
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

// Add new course
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

    // Upload image first
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

// GET Educator Courses
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
