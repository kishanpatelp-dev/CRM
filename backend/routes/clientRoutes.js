import express from "express";
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateClient } from "../middleware/validateClient.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router
  .route("/")
  .post(protect, validateClient, validateRequest, createClient)
  .get(protect, getClients);

router
  .route("/:id")
  .get(protect, getClientById)
  .put(protect, validateClient, validateRequest, updateClient)
  .delete(protect, deleteClient); // <-- still needs protect

// Fix: protect delete as well
router.route("/:id").delete(protect, deleteClient);

export default router;
