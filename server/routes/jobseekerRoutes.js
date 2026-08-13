import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
} from "../controllers/jobseekerController.js";
import { verifyJobseekerToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Ensure upload directories exist
const photoDir = "uploads/profilePhotos";
if (!fs.existsSync(photoDir)) {
  fs.mkdirSync(photoDir, { recursive: true });
}

// Multer Storage for Profile Photos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, photoDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const ext = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mime = filetypes.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only JPEG and PNG images are allowed for profile photos"));
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// Multer Storage for Resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const uploadResumeHandler = multer({
  storage: resumeStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf" || ext === ".doc" || ext === ".docx") cb(null, true);
    else cb(new Error("Only .pdf, .doc, and .docx files are allowed for resumes"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Routes
router.get("/profile", verifyJobseekerToken, getProfile);
router.put("/profile", verifyJobseekerToken, updateProfile);
router.post("/upload-photo", verifyJobseekerToken, uploadPhoto.single("photo"), uploadProfilePhoto);
router.post("/upload-resume", verifyJobseekerToken, uploadResumeHandler.single("resume"), uploadResume);

export default router;
