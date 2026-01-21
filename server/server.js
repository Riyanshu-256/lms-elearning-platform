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
  "https://lms-elearning-platform.vercel.app",
  "http://localhost:5173",
];

// ================= DATABASE =================
await connectDB();
await connectCloudinary();

// ================= CORS (TOP PRIORITY) =================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  }),
);

// REQUIRED FOR PREFLIGHT
app.options("*", cors());

// ================= BODY PARSER =================
app.use(express.json());

// ================= WEBHOOKS =================
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// ================= CLERK AUTH =================
app.use(clerkMiddleware());

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
