import Stripe from "stripe";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= GET USER DATA =================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= USER ENROLLED COURSES =================
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const userData = await User.findById(userId).populate("enrolledCourses");

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= PURCHASE COURSE =================
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID required",
      });
    }

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.status(404).json({
        success: false,
        message: "User or Course not found",
      });
    }

    // Price calculation
    const finalAmount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100;

    // ================= CREATE STRIPE SESSION =================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY?.toLowerCase() || "inr",
            product_data: {
              name: courseData.courseTitle,
            },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-cancel`,
    });

    // ================= SAVE PURCHASE =================
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount: Number(finalAmount.toFixed(2)),
      status: "pending",
      sessionId: session.id,
    });

    // ================= ADD METADATA =================
    await stripe.checkout.sessions.update(session.id, {
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({
      success: true,
      // Frontend expects `session_url` and will redirect the user to this Stripe Checkout URL
      session_url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};

// ================= UPDATE USER COURSE PROGRESS =================
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { courseId, lectureId } = req.body;

    if (!courseId || !lectureId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Lecture ID required",
      });
    }

    const progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });

    // If progress exists
    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture already completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    }
    // If progress not exists
    else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({
      success: true,
      message: "Progress updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET USER COURSE PROGRESS =================
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({
      userId,
      courseId,
    });

    res.json({
      success: true,
      progressData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//========================== Add User Rating to Course ========================
export const addUserRating = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // Validate input
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Invalid Details",
      });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user purchased course
    if (!user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course",
      });
    }

    // Check if user already rated
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      // Update rating
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      course.courseRatings.push({
        userId,
        rating,
      });
    }

    await course.save();

    return res.json({
      success: true,
      message: "Rating added successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
