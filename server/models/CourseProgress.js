import mongoose from "mongoose";

// Schema to track user's course progress
const courseProgressSchema = new mongoose.Schema(
  {
    // Stores Clerk user ID
    userId: {
      type: String,
      required: true,
    },

    // Stores Course ID
    courseId: {
      type: String,
      required: true,
    },

    // Indicates whether course is fully completed
    completed: {
      type: Boolean,
      default: false,
    },

    // Array to store completed lecture IDs
    lectureCompleted: [
      {
        type: String, // lectureId
      },
    ],
  },
  {
    minimize: false, // keeps empty objects in DB
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Export CourseProgress model
export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
