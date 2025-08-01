import Client from "../models/Client.js";
import asyncHandler from "express-async-handler";

const createClient = asyncHandler(async (req, res) => {
  const { name, email, phone, company, status } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  // Save with logged-in user's ID
  const client = await Client.create({
    user: req.user._id, // ensure this is coming from protect middleware
    name,
    email,
    phone,
    company,
    status: status || "pending",
  });

  res.status(201).json(client);
});

const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ user: req.user._id });
  res.status(200).json(clients);
});


const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json(client);
});

const updateClient = asyncHandler(async (req, res) => {
  const updatedClient = await Client.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  if (!updatedClient) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json(updatedClient);
});

const deleteClient = asyncHandler(async (req, res) => {
  const deleted = await Client.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json({ message: "Client deleted successfully" });
});

export { createClient, getClients, getClientById, updateClient, deleteClient };
