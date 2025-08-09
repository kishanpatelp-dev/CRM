import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { updateProjectProgressAndStatus } from "../utils/projectProgress.js";

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignee, status = "pending" } = req.body;
    const { projectId } = req.params;

    const task = await Task.create({
      projectId,
      title,
      description,
      dueDate,
      assignee,
      status,
    });

    await updateProjectProgressAndStatus(projectId);
    res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    res.status(500).json({ message: "Could not create task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.projectId);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(task, updates);
    await task.save();
    await updateProjectProgressAndStatus(task.projectId);

    res.json(task);
  } catch (err) {
    console.error("updateTask error:", err);
    res.status(500).json({ message: "Could not update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.projectId);
    const isOwner = project.owner.toString() === req.user._id.toString();
    const isCollaborator = project.collaborators.some(
      (c) => c.userId.toString() === req.user._id.toString()
    );
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await task.deleteOne();
    await updateProjectProgressAndStatus(task.projectId);
    res.status(204).end();
  } catch (err) {
    console.error("deleteTask error:", err);
    res.status(500).json({ message: "Could not delete task" });
  }
};

const getTasksForProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId })
      .sort({ createdAt: -1 })
      .populate("assignee", "name email"); 

    res.json(tasks);
  } catch (err) {
    console.error("getTasksForProject error:", err);
    res.status(500).json({ message: "Could not fetch tasks" });
  }
};

export { createTask, updateTask, deleteTask, getTasksForProject };