import express from "express";
import {
  addUserRating,
  confirmPurchase,
  getUserCourseProgress,
  getUserData,
  getCourseStatus,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/userController.js";

const userRouter = express.Router();

/* ================= PROFILE ================= */
userRouter.get("/profile", getUserData);

/* ================= USER COURSES ================= */
userRouter.get("/courses", userEnrolledCourses);

/* ================= PURCHASE ================= */
userRouter.post("/purchase", purchaseCourse);
userRouter.post("/confirm-purchase", confirmPurchase);

/* ================= COURSE PROGRESS ================= */
userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);

/* ================= RATING ================= */
userRouter.post("/add-rating", addUserRating);
userRouter.get("/course-status/:courseId", getCourseStatus);

export default userRouter;
