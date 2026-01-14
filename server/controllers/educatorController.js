import { clerkClient } from "@clerk/express";

export const updateRoleToEducator = async (req, res) => {
  try {
    console.log("AUTH OBJECT", req.auth); // DEBUG

    const userId = req.auth?.userId;

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
      publicMetadata: {
        role: "educator",
      },
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
