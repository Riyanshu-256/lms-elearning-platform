import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// DB
await connectDB();
await connectCloudinary();

// ================= STRIPE WEBHOOK (RAW BODY FIRST) =================
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ================= NORMAL MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// CLERK MIDDLEWARE
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("API Working"));

// Clerk webhook
app.post("/clerk", express.json(), clerkWebhooks);

// Educator routes
app.use("/api/educator", educatorRouter);

// Course routes
app.use("/api/course", courseRouter);

// User Routes
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on ${PORT}`);
});
