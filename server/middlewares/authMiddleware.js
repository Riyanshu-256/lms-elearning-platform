import { verifyToken } from "@clerk/backend";

export const protectEducator = async (req, res, next) => {
  try {
    console.log("=== AUTH DEBUG ===");

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    console.log("TOKEN PAYLOAD:", payload);

    const userId = payload.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
};
