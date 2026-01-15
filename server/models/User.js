// import mongoose
import mongoose from "mongoose";

// Create Schema or blueprint of the user
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId, // Stores the unique ID of a course document
        ref: "Course", // Creates a reference (relation) with the "course" collection
      },
    ],
  },
  { timestamps: true }
);

// Create User model
const User = mongoose.model("User", userSchema);

export default User;
