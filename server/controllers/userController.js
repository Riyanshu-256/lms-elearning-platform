import Stripe from "stripe";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= GET USER DATA ================= */
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= USER ENROLLED COURSES ================= */
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId).populate("enrolledCourses");

    res.json({
      success: true,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PURCHASE COURSE ================= */
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();

    const course = await Course.findById(courseId);

    const finalAmount =
      course.coursePrice - (course.discount * course.coursePrice) / 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: course.courseTitle },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancel`,
    });

    await Purchase.create({
      courseId,
      userId,
      amount: finalAmount,
      status: "pending",
      sessionId: session.id,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CONFIRM PURCHASE ================= */
export const confirmPurchase = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const { userId } = req.auth();

    const purchase = await Purchase.findOne({ sessionId, userId });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.json({
        success: false,
        message: "Payment not completed",
      });
    }

    purchase.status = "completed";
    await purchase.save();

    await Course.updateOne(
      { _id: purchase.courseId },
      { $addToSet: { enrolledStudents: userId } },
    );

    await User.updateOne(
      { _id: userId },
      { $addToSet: { enrolledCourses: purchase.courseId } },
    );

    res.json({
      success: true,
      message: "Enrollment confirmed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE PROGRESS ================= */
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (progress) {
      if (!progress.lectureCompleted.includes(lectureId)) {
        progress.lectureCompleted.push(lectureId);
        await progress.save();
      }
    } else {
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

/* ================= GET PROGRESS ================= */
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const { courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    res.json({
      success: true,
      progressData: progress,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADD USER RATING ================= */
export const addUserRating = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId, rating } = req.body;

    if (!courseId || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Invalid input",
      });
    }

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    const isEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId,
    );

    if (!isEnrolled) {
      return res.json({
        success: false,
        message: "Not enrolled",
      });
    }

    const alreadyRated = course.courseRatings.some((r) => r.userId === userId);

    if (alreadyRated) {
      return res.json({
        success: false,
        message: "Already rated",
      });
    }

    course.courseRatings.push({ userId, rating });
    await course.save();

    res.json({
      success: true,
      message: "Rating added",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= COURSE STATUS ================= */
export const getCourseStatus = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { courseId } = req.params;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    const isEnrolled = user.enrolledCourses.some(
      (id) => id.toString() === courseId,
    );

    const hasRated = course.courseRatings.some((r) => r.userId === userId);

    res.json({
      success: true,
      isEnrolled,
      hasRated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
