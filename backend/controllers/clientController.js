import Client from "../models/Client.js";

const createClient = asyncHandler(async (req, res) => {
  const { name, email, phone, company, Status } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }

  const client = new Client({
    user: req.user.id,
    name,
    email,
    phone,
  });

  const createdClient = await client.save();
  res.status(201).json(createdClient);
});

const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({ user: req.user.id }); // fetch only user's clients
  res.json(clients);
});

const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json(client);
});

const updateClient = asyncHandler(async (req, res) => {
  const updatedClient = await Client.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );

  if (!updatedClient) {
    return res
      .status(404)
      .json({ message: "Client not found or unauthorized" });
  }

  res.status(200).json(updatedClient);
});

const deleteClient = asyncHandler(async (req, res) => {
  try {
    const deleted = await Client.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Client not found or unauthorized" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete client", error });
  }
});


module.exports = {
  createClient,
  getClients,   
  getClientById,
  updateClient,     
  deleteClient
};

