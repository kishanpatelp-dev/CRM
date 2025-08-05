import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js"; 
import { uploadAvatar } from "../middleware/uploadAvatar.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/", protect, uploadAvatar.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const { name, bio } = req.body;
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;

    if (req.file) {
      user.avatarUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();
    const safeUser = user.toObject();
    delete safeUser.password;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
});

export default router;
