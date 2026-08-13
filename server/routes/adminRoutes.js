import express from "express";
import {
  getDashboardStats,
  getAllJobseekers,
  deleteJobseeker,
  getContactMessages,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", verifyToken, getDashboardStats);
router.get("/jobseekers", verifyToken, getAllJobseekers);
router.delete("/jobseekers/:id", verifyToken, deleteJobseeker);
router.get("/contact-messages", verifyToken, getContactMessages);

export default router;
