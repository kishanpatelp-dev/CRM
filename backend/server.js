import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import profileRoutes from "./routes/profile.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import cors from "cors";
import path from "path";
import "dotenv/config";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/profile", profileRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => {
    console.log(`Server running on port 5000`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
