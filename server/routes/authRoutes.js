import express from "express";
import multer from "multer";
import path from "path";
import {
  adminLogin,
  adminRegister,
  adminValidate,
  adminForgotPassword,
  adminResetPassword,
  jobseekerRegister,
  jobseekerLogin,
  jobseekerForgotPassword,
  jobseekerResetPassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/security.js";

const router = express.Router();

// Multer Storage Configuration for Registration Resume Upload
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Admin Auth Routes
router.post("/admin/login", authRateLimiter, adminLogin);
router.post("/admin/register", adminRegister);
router.get("/admin/validate", verifyToken, adminValidate);
router.post("/admin/forgot-password", authRateLimiter, adminForgotPassword);
router.post("/admin/reset-password", adminResetPassword);

// Jobseeker Auth Routes
router.post("/jobseeker/register", upload.single("resume"), jobseekerRegister);
router.post("/jobseeker/login", authRateLimiter, jobseekerLogin);
router.post("/jobseeker/forgot-password", authRateLimiter, jobseekerForgotPassword);
router.post("/jobseeker/reset-password", jobseekerResetPassword);

export default router;
