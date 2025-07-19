const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => {
    console.log(`Server running on port 5000`);
  });
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});
