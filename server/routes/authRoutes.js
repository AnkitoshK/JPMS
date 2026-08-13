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

import verifyToken from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/security.js";

const router = express.Router();

// ======================================================
// Multer Storage Configuration for Resume Upload
// ======================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf" || ext === ".doc" || ext === ".docx") {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only .pdf, .doc, and .docx formats are allowed for resumes"
        )
      );
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// ======================================================
// Admin Authentication Routes
// ======================================================

// Admin Login
router.post(
  "/admin/login",
  authRateLimiter,
  adminLogin
);

// Admin Registration
router.post(
  "/admin/register",
  adminRegister
);

// Admin Token Validation
router.get(
  "/admin/validate",
  verifyToken,
  adminValidate
);

// Admin Forgot Password
router.post(
  "/admin/forgot-password",
  authRateLimiter,
  adminForgotPassword
);

// Admin Reset Password
router.post(
  "/admin/reset-password",
  adminResetPassword
);

// ======================================================
// Jobseeker Authentication Routes
// ======================================================

// Jobseeker Registration
router.post(
  "/jobseeker/register",
  upload.single("resume"),
  jobseekerRegister
);

// Jobseeker Login
router.post(
  "/jobseeker/login",
  authRateLimiter,
  jobseekerLogin
);

// Jobseeker Forgot Password
router.post(
  "/jobseeker/forgot-password",
  authRateLimiter,
  jobseekerForgotPassword
);

// Jobseeker Reset Password
router.post(
  "/jobseeker/reset-password",
  jobseekerResetPassword
);

export default router;