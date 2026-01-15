import express from "express";
import {
  addCourse,
  updateRoleToEducator,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import { clerkMiddleware } from "@clerk/express";

const educatorRouter = express.Router();

// Update role to Educator
educatorRouter.post(
  "/update-role",
  clerkMiddleware(), // Auth check
  updateRoleToEducator
);

// Add new course
educatorRouter.post(
  "/add-course",
  clerkMiddleware(),
  protectEducator,
  upload.single("image"),
  addCourse
);

export default educatorRouter;
