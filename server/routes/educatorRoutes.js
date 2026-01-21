import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
} from "../controllers/educatorController.js";

import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

/* ================= UPDATE ROLE ================= */
educatorRouter.post("/update-role", protectEducator, updateRoleToEducator);

/* ================= ADD COURSE ================= */
educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"), // must match frontend
  addCourse,
);

/* ================= COURSES ================= */
educatorRouter.get("/courses", protectEducator, getEducatorCourses);

/* ================= DASHBOARD ================= */
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);

/* ================= ENROLLED STUDENTS ================= */
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData,
);

export default educatorRouter;
