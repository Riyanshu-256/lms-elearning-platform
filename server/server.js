import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

// Connect to the database
await connectDB();
// Connect to the Cloudinary
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json()); // IMPORTANT

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", express.json(), clerkWebhooks);

// Protect only educator routes
app.use("/api/educator", clerkMiddleware(), educatorRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
