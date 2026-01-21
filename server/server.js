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

// ================= ALLOWED ORIGINS =================
const allowedOrigins = [
  process.env.CLIENT_URL, // production frontend
  "http://localhost:5173", // local dev
];

// ================= DATABASE =================
await connectDB();
await connectCloudinary();

// ================= STRIPE WEBHOOK =================
// MUST be before express.json()
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ================= CORS =================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight
app.options("*", cors());

// ================= BODY PARSER =================
app.use(express.json());

// ================= CLERK AUTH =================
app.use(clerkMiddleware());

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("API Working");
});

// Clerk Webhook
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// App Routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
