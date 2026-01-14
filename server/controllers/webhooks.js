import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    const wh = new Webhook(WEBHOOK_SECRET);

    const payload = req.body; // raw buffer

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers);

    const { type, data } = evt;

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
    console.log("Webhook Error:", err.message);
    res.status(400).json({ error: "Webhook verification failed" });
  }
};
