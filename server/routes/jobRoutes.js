import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobFilterOptions,
} from "../controllers/jobController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Job Routes
router.get("/", getJobs);
router.get("/filters", getJobFilterOptions);
router.get("/:id", getJobById);

// Admin Protected Job Routes
router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);

export default router;
