import db from "../db.js";
import path from "path";
import fs from "fs";

// Fetch Jobseeker Profile
export const getProfile = async (req, res) => {
  try {
    const jobseeker_id = req.user?.id;
    const [rows] = await db.query(
      "SELECT id, name, email, phone, skills, experience, education, location, resume, profilePhoto, created_at FROM jobseekers WHERE id = ?",
      [jobseeker_id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Jobseeker profile not found" });
    }

    res.json({ success: true, profile: rows[0] });
  } catch (error) {
    console.error("Error fetching jobseeker profile:", error);
    res.status(500).json({ success: false, message: "Server error loading profile" });
  }
};

// Update Jobseeker Profile
export const updateProfile = async (req, res) => {
  try {
    const jobseeker_id = req.user?.id;
    const { name, phone, skills, experience, education, location } = req.body;

    await db.query(
      `UPDATE jobseekers 
       SET name=?, phone=?, skills=?, experience=?, education=?, location=?
       WHERE id=?`,
      [name, phone, skills, experience, education, location, jobseeker_id]
    );

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// Upload Profile Photo
export const uploadProfilePhoto = async (req, res) => {
  try {
    const jobseeker_id = req.user?.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No photo file provided" });
    }

    const photoPath = `uploads/profilePhotos/${req.file.filename}`.replace(/\\/g, "/");

    await db.query("UPDATE jobseekers SET profilePhoto = ? WHERE id = ?", [photoPath, jobseeker_id]);

    res.json({
      success: true,
      message: "Profile photo uploaded successfully",
      profilePhoto: photoPath,
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    res.status(500).json({ success: false, message: "Failed to upload profile photo" });
  }
};

// Upload Resume
export const uploadResume = async (req, res) => {
  try {
    const jobseeker_id = req.user?.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No resume file provided" });
    }

    const resumePath = `uploads/${req.file.filename}`.replace(/\\/g, "/");

    await db.query("UPDATE jobseekers SET resume = ? WHERE id = ?", [resumePath, jobseeker_id]);

    res.json({
      success: true,
      message: "Resume uploaded successfully",
      resume: resumePath,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ success: false, message: "Failed to upload resume" });
  }
};
