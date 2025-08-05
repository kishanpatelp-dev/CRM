import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { updateProjectProgressAndStatus } from "../utils/projectProgress.js";


const createTask = async (req, res) => {
  try {
    const {
      projectId,
      title,
      description,
      dueDate,
      assignedTo,
      status = "pending",
    } = req.body;

    const task = await Task.create({
      projectId,
      title,
      description,
      dueDate,
      assignedTo,
      status,
    });

    await updateProjectProgressAndStatus(projectId);

    return res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ message: "Could not create task" });
  }
};


const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });


    Object.assign(task, updates);
    await task.save();

    await updateProjectProgressAndStatus(task.projectId);

    return res.json(task);
  } catch (err) {
    console.error("updateTask error:", err);
    return res.status(500).json({ message: "Could not update task" });
  }
};


const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });


    const projectId = task.projectId;
    await task.remove(); 
    await updateProjectProgressAndStatus(projectId);

    return res.status(204).end();
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).json({ message: "Could not delete task" });
  }
};


const getTasksForProject = async (req, res) => {
  try {
    const { projectId } = req.params;


    const tasks = await Task.find({ projectId }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    console.error("getTasksForProject error:", err);
    return res.status(500).json({ message: "Could not fetch tasks" });
  }
};

export { createTask, updateTask, deleteTask, getTasksForProject };
