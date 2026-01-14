import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    const whook = new Webhook(WEBHOOK_SECRET);

    // Convert raw buffer to string
    const payload = req.body.toString();

    // Verify webhook
    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { type, data } = JSON.parse(payload);

    // USER CREATED
    if (type === "user.created") {
      const userData = {
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      };

      await User.create(userData);
      console.log("User Created");

      return res.json({ success: true });
    }

    // USER UPDATED
    if (type === "user.updated") {
      const userData = {
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      };

      await User.findByIdAndUpdate(data.id, userData);
      console.log("User Updated");

      return res.json({ success: true });
    }

    // USER DELETED
    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      console.log("User Deleted");

      return res.json({ success: true });
    }

    res.json({ message: "Event received" });
  } catch (error) {
    console.log("Webhook Error:", error);

    res.status(400).json({
      message: "Webhook verification failed",
    });
  }
};
