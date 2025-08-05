import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { canEditProject } from "../middleware/projectAuth.js";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksForProject,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/create/:projectId", protect, canEditProject, createTask);

router.get("/project/:projectId", protect, canEditProject, getTasksForProject);

router.put("/update/:taskId", protect, canEditProject, updateTask);

router.delete("/delete/:taskId", protect, canEditProject, deleteTask);

export default router;
