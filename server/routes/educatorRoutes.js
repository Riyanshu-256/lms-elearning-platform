import express from "express";
import {
  addCourse,
  updateRoleToEducator,
} from "../controllers/educatorController.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// Update role
educatorRouter.post("/update-role", protectEducator, updateRoleToEducator);

// Add new course
educatorRouter.post(
  "/add-course",
  protectEducator,
  upload.single("image"),
  addCourse
);

export default educatorRouter;
