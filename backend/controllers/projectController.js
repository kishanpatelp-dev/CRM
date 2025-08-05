import Project from "../models/Project.js";
import User from "../models/User.js";
import {
  computeProjectProgress,
  deriveProjectStatus,
} from "../utils/projectProgress.js";

const getProjectDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();
    if (!project) return res.status(404).json({ message: "Project not found" });

    const progress = await computeProjectProgress(id);
    const status = deriveProjectStatus(progress, project.endDate);

    return res.json({
      ...project,
      progress,
      status,
      isOverdue:
        status !== "Completed" &&
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
    if (!name || !clientId) {
      return res
        .status(400)
        .json({ message: "Project name and client ID are required" });
    }

    const newProject = new Project({
      name,
      description,
      client: clientId,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    const savedProject = await newProject.save();
    return res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create project" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json(projects);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { name, description, startDate, endDate },
      { new: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    return res.json(updatedProject);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Project.findOneAndDelete({
      _id: id,
      createdBy: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }

    return res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete project" });
  }
};

const addCollaborator = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.projectId);
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (project.collaborators.includes(user._id)) {
    return res.status(400).json({ message: "User already a collaborator" });
  }

  project.collaborators.push(user._id);
  await project.save();

  res.status(200).json({ message: "Collaborator added" });
};

const removeCollaborator = async (req, res) => {
  const { email } = req.body;
  const project = await Project.findById(req.params.projectId);
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  project.collaborators = project.collaborators.filter(
    (id) => id.toString() !== user._id.toString()
  );
  await project.save();

  res.status(200).json({ message: "Collaborator removed" });
};


export {
  getProjectDetail,
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  addCollaborator,
  removeCollaborator
};
