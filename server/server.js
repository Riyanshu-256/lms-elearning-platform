import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import courseRouter from "./routes/courseRoute.js";

// Check secret key
if (!process.env.CLERK_SECRET_KEY) {
  console.error("⚠️ CLERK_SECRET_KEY missing in .env");
}

const app = express();

// DB
await connectDB();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// CLERK MIDDLEWARE (ROUTES SE PEHLE)
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", express.json(), clerkWebhooks);

// Educator routes
app.use("/api/educator", educatorRouter);

// Course routes
app.use("/api/course", express.json(), courseRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
