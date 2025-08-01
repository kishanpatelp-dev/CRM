import express from "express";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.get("/dashboard", protect, (req, res) => {
    res.status(200).json({
        message: "Dashboard accessed successfully",
        user: req.user,
    });
});

export default router;