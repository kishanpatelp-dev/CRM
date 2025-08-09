import Project from "../models/Project.js";
import User from "../models/User.js";
import {
  computeProjectProgress,
  deriveProjectStatus,
} from "../utils/projectProgress.js";

const getClientProjects = async (req, res) => {
  try {
    const { clientId } = req.params;
    const projects = await Project.find({ clientId })
      .populate("clientId")
      .populate("collaborators.userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects for client" });
  }
};

const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("clientId")
      .populate("collaborators.userId", "name email")
      .lean();

    if (!project) return res.status(404).json({ message: "Project not found" });

    const progress = await computeProjectProgress(id);
    const status = deriveProjectStatus(progress, project.endDate);

    return res.json({
      ...project,
      progress,
      status,
      isOverdue:
        status !== "completed" &&
        project.endDate &&
        new Date() > new Date(project.endDate),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, clientId, startDate, endDate } = req.body;
    if (!name ) {
      return res.status(400).json({ message: "Name required" });
    }

    const newProject = new Project({
      name,
      description,
      clientId,
      startDate,
      endDate,
      owner: req.user._id,
      collaborators: [{ userId: req.user._id, role: "admin" }],
    });

    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { "collaborators.userId": req.user._id }],
    })
      .populate("clientId")
      .populate("collaborators.userId", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate },
      { new: true }
    );

    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

const addCollaborator = async (req, res) => {
  try {
    const { email, role } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const already = project.collaborators.find(
      (c) => c.userId.toString() === user._id.toString()
    );
    if (already)
      return res.status(400).json({ message: "Already a collaborator" });

    project.collaborators.push({ userId: user._id, role: role || "viewer" });
    await project.save();

    res.status(200).json({ message: "Collaborator added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add collaborator" });
  }
};

const removeCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    project.collaborators = project.collaborators.filter(
      (c) => c.userId.toString() !== user._id.toString()
    );
    await project.save();

    res.status(200).json({ message: "Collaborator removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove collaborator" });
  }
};

export {
  getProjectDetail,
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator,
  getClientProjects,
};
