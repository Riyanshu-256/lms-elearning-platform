// Import Clerk client (used to get user details from Clerk)
import { clerkClient } from "@clerk/express";

// Middleware (Protect Educator Routes)
export const protectEducator = async (req, res, next) => {
  try {
    // Get logged-in user ID from auth middleware
    const { userId } = req.auth();

    // Fetch user details from Clerk
    const response = await clerkClient.users.getUser(userId);

    // Check if user role is NOT educator
    if (response.publicMetadata.role !== "educator") {
      return res.json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // If user is educator → allow request to continue
    next();
  } catch (error) {
    // If any error occurs
    res.json({
      success: false,
      message: error.message,
    });
  }
};
