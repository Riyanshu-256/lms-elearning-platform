// Import mongoose
import mongoose from "mongoose";

// Lecture Schema
const lectureSchema = new mongoose.Schema(
  {
    // Unique ID for lecture
    lectureId: { type: String, required: true },

    // Lecture title
    lectureTitle: { type: String, required: true },

    // Duration of lecture (in minutes)
    lectureDuration: { type: Number, required: true },

    // Video URL
    lectureUrl: { type: String, required: true },

    // Is this lecture free preview?
    isPreview: { type: Boolean, required: true },

    // Order of lecture in chapter
    lectureOrder: { type: Number, required: true },
  },
  {
    _id: false, // Prevent MongoDB from creating extra _id for each lecture
  }
);

//  Chapter Schema
const chapterSchema = new mongoose.Schema(
  {
    // Unique ID for chapter
    chapterId: { type: String, required: true },

    // Chapter number/order
    chapterOrder: { type: Number, required: true },

    // Chapter title
    chapterTitle: { type: String, required: true },

    // All lectures inside this chapter
    chapterContent: [lectureSchema],
  },
  {
    _id: false, // No auto-generated _id for chapters
  }
);

// Course Schema (Main)
const courseSchema = new mongoose.Schema(
  {
    // Course name
    courseTitle: { type: String, required: true },

    // Course description
    courseDescription: { type: String, required: true },

    // Course thumbnail image
    courseThumbnail: { type: String },

    // Course price
    coursePrice: { type: Number, required: true },

    // Course published or not
    isPublished: { type: Boolean, default: true },

    // Discount percentage
    discount: { type: Number, required: true, min: 0, max: 100 },

    // All chapters inside course
    courseContent: [chapterSchema],

    // Ratings given by users
    courseRatings: [
      {
        userId: { type: String }, // User ID
        rating: { type: Number, min: 1, max: 5 }, // Rating (1-5)
      },
    ],

    // Educator (teacher) who created course
    educator: { type: String, ref: "User", required: true },

    // Students enrolled in course
    enrolledStudents: [{ type: String, ref: "User" }],
  },
  {
    timestamps: true, // Adds createdAt & updatedAt
    minimize: false, // Keeps empty objects in DB
  }
);

// =====================
// Create Model
// =====================
const Course = mongoose.model("Course", courseSchema);
// Creates "courses" collection in MongoDB

// Export model
export default Course;
