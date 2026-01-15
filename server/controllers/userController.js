import User from "../models/User.js";

// Create controller function to get user data
export const getUserData = async (req, res) => {
  try {
    // get userId
    const { userId } = req.auth();
    console.log("Auth userId:", userId);
    // find the user from the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Users Enrolled Courses with lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
