import Stripe from "stripe";
import { Webhook } from "svix";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";
import Course from "../models/Course.js";

// Stripe init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= CLERK WEBHOOK =================
export const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    const wh = new Webhook(WEBHOOK_SECRET);

    const payload = req.body;
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers);
    const { type, data } = evt;

    console.log("Clerk Event:", type);

    switch (type) {
      case "user.created":
        await User.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    res.json({ success: true });
  } catch (err) {
    console.log("Clerk Webhook Error:", err.message);
    res.status(400).json({ error: "Webhook verification failed" });
  }
};

// ================= STRIPE WEBHOOK =================
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Stripe webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // ✅ PAYMENT SUCCESS
      case "checkout.session.completed": {
        const session = event.data.object;

        const { purchaseId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);

        // enroll user
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("✅ Payment Success - User Enrolled");

        break;
      }

      // ❌ PAYMENT FAILED
      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        const purchaseData = await Purchase.findById(purchaseId);
        purchaseData.status = "failed";
        await purchaseData.save();

        console.log("❌ Payment Failed");

        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.log("Stripe webhook handler error:", error.message);
    res.status(500).json({ error: "Webhook handler failed" });
  }
};
