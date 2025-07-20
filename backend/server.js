import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import cors from "cors";
import "dotenv/config";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/clients", clientRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => {
    console.log(`Server running on port 5000`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
