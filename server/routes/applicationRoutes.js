import express from "express";
import multer from "multer";
import path from "path";
import {
  submitApplication,
  getJobseekerApplications,
  getAllApplications,
  updateApplicationStatus,
  downloadApplicationResume,
} from "../controllers/applicationController.js";
import { verifyToken, verifyJobseekerToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer Storage Configuration for Resume Submissions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf" || ext === ".doc" || ext === ".docx") {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, and .docx formats are allowed for resumes"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Jobseeker Application Routes
router.post("/", verifyJobseekerToken, upload.single("resume"), submitApplication);
router.get("/my-applications", verifyJobseekerToken, getJobseekerApplications);

// Admin Application Management Routes
router.get("/admin/all", verifyToken, getAllApplications);
router.put("/:id/status", verifyToken, updateApplicationStatus);
router.get("/:id/resume", verifyToken, downloadApplicationResume);

export default router;
