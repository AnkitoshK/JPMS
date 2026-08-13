import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import sendMail from "../config/sendMail.js";

// ================= ADMIN AUTH CONTROLLERS =================

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "fallback_jwt_secret_key_12345",
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const adminRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const [existing] = await db.query("SELECT id FROM admins WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Admin with this email already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);
    await db.query(
      "INSERT INTO admins (name, email, password, created_at) VALUES (?, ?, ?, NOW())",
      [name, email, hashed]
    );

    res.status(201).json({ success: true, message: "Admin registered successfully" });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

export const adminValidate = async (req, res) => {
  try {
    res.json({ success: true, admin: req.user });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const [rows] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Admin account not found" });
    }

    const admin = rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.query(
      "UPDATE admins SET reset_otp = ?, reset_otp_expiry = ? WHERE id = ?",
      [otp, expiry, admin.id]
    );

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color:#0a66c2;">JPMS Admin Password Reset</h2>
        <p>Hello <strong>${admin.name}</strong>,</p>
        <p>Your OTP code to reset your password is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0a66c2; margin: 20px 0;">${otp}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>Regards,<br/>JPMS Team</p>
      </div>
    `;

    await sendMail(admin.email, "JPMS Admin Password Reset OTP", htmlContent);
    res.json({ success: true, message: "OTP sent successfully to your email" });
  } catch (err) {
    console.error("Admin Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to send reset OTP" });
  }
};

export const adminResetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM admins WHERE email = ? AND reset_otp = ?",
      [email, otp]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    const admin = rows[0];
    if (new Date(admin.reset_otp_expiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP code has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.query(
      "UPDATE admins SET password = ?, reset_otp = NULL, reset_otp_expiry = NULL WHERE id = ?",
      [hashedPassword, admin.id]
    );

    res.json({ success: true, message: "Password reset successful. Please log in with your new password." });
  } catch (err) {
    console.error("Admin Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};


// ================= JOBSEEKER AUTH CONTROLLERS =================

export const jobseekerRegister = async (req, res) => {
  const { name, email, password, phone, skills, experience } = req.body;
  
  if (!name || !email || !password || !phone || !skills || !experience || !req.file) {
    return res.status(400).json({ success: false, message: "All fields including resume file are required" });
  }

  try {
    const [existing] = await db.query("SELECT id FROM jobseekers WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const resumePath = `uploads/${req.file.filename}`.replace(/\\/g, "/");

    await db.query(
      "INSERT INTO jobseekers (name, email, password, phone, skills, experience, resume, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
      [name, email, hashed, phone, skills, experience, resumePath]
    );

    res.status(201).json({ success: true, message: "Jobseeker registered successfully" });
  } catch (err) {
    console.error("Jobseeker Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

export const jobseekerLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM jobseekers WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = rows[0];
    const stored = user.password || "";
    let ok = false;

    if (stored.startsWith("$2a$") || stored.startsWith("$2b$")) {
      ok = await bcrypt.compare(password, stored);
    } else {
      ok = password === stored;
      if (ok) {
        const newHash = await bcrypt.hash(password, 10);
        await db.query("UPDATE jobseekers SET password = ? WHERE id = ?", [newHash, user.id]);
      }
    }

    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "jobseeker" },
      process.env.JWT_SECRET || "fallback_jwt_secret_key_12345",
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
    );

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      skills: user.skills,
      experience: user.experience,
      education: user.education,
      location: user.location,
      resume: user.resume,
      profilePhoto: user.profilePhoto,
    };

    res.json({ success: true, message: "Login successful", token, user: userPayload });
  } catch (err) {
    console.error("Jobseeker Login Error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

export const jobseekerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const [rows] = await db.query("SELECT * FROM jobseekers WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Account not found with this email" });
    }

    const seeker = rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      "UPDATE jobseekers SET reset_otp = ?, reset_otp_expiry = ? WHERE id = ?",
      [otp, expiry, seeker.id]
    );

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color:#0a66c2;">JPMS Jobseeker Password Reset</h2>
        <p>Hello <strong>${seeker.name}</strong>,</p>
        <p>Your OTP code to reset your password is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0a66c2; margin: 20px 0;">${otp}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>Regards,<br/>JPMS Team</p>
      </div>
    `;

    await sendMail(seeker.email, "JPMS Password Reset OTP", htmlContent);
    res.json({ success: true, message: "OTP sent successfully to your email" });
  } catch (err) {
    console.error("Jobseeker Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to send reset OTP" });
  }
};

export const jobseekerResetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM jobseekers WHERE email = ? AND reset_otp = ?",
      [email, otp]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, message: "Invalid OTP code" });
    }

    const seeker = rows[0];
    if (new Date(seeker.reset_otp_expiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP code has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "UPDATE jobseekers SET password = ?, reset_otp = NULL, reset_otp_expiry = NULL WHERE id = ?",
      [hashedPassword, seeker.id]
    );

    res.json({ success: true, message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Jobseeker Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
};
