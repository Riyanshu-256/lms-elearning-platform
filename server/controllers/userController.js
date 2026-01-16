import Stripe from "stripe";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// Stripe initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= GET USER DATA =================
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= USER ENROLLED COURSES =================
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();

    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ================= PURCHASE COURSE =================
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const { userId } = req.auth();

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({
        success: false,
        message: "User or Course not found",
      });
    }

    // Calculate amount
    const finalAmount =
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100;

    // Save purchase
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount: finalAmount.toFixed(2),
      status: "pending",
    });

    // Stripe session
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
            unit_amount: Math.floor(finalAmount * 100),
          },
          quantity: 1,
        },
      ],

      metadata: {
        purchaseId: newPurchase._id.toString(),
        courseId: courseData._id.toString(),
        userId,
      },

      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/payment-cancel`,
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
};
