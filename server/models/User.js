import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true, // Clerk userId
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // prevent duplicate users
      lowercase: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    resume: {
      type: String,
      default: "", // for future use
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
