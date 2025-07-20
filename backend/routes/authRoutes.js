import express from "express";
import { register, login } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/validateAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";
import { getUserProfile } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateRegister, validateRequest, register);
router.post("/login", validateLogin, validateRequest, login);
router.get("/me", protect, getUserProfile);

export default router;
