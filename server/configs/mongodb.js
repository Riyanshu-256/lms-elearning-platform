import mongoose from "mongoose";

// Connect to the MongoDB database
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database Connected Successfully")
    );

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};

export default connectDB;
