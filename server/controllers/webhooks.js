// Import Webhook tool from svix
// This is used to check if webhook is really sent by Clerk (security)
import { Webhook } from "svix";

// Import User model (MongoDB schema)
import User from "../models/User.js";

// This function will run when Clerk sends webhook
export const clerkWebhooks = async (req, res) => {
  try {
    // Get secret key from .env file
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    // Create webhook object
    const whook = new Webhook(WEBHOOK_SECRET);

    // Verify webhook (security check)
    // If verification fails → error will come
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Get event type & data from Clerk
    const { type, data } = req.body;

    // Switch based on event type
    switch (type) {
      // When new user signs up
      case "user.created": {
        // Create user object
        const userData = {
          _id: data.id, // Clerk user id
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        // Save user in database
        await User.create(userData);

        console.log("User Created Successfully");

        // Send response
        res.json({ success: true });
        break;
      }

      // When user updates profile
      case "user.updated": {
        // New updated data
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        // Update user in database
        await User.findByIdAndUpdate(data.id, userData);

        console.log("User Updated Successfully");

        res.json({ success: true });
        break;
      }

      // When user deletes account
      case "user.deleted": {
        // Delete user from database
        await User.findByIdAndDelete(data.id);

        console.log("User Deleted Successfully");

        res.json({ success: true });
        break;
      }

      // If event type not handled
      default:
        res.json({ message: "No action for this event" });
    }
  } catch (error) {
    // If any error happens
    console.log("Webhook Error:", error);

    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
};
