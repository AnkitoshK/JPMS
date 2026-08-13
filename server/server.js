import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";

// Import Security & Modular Routes
import { apiRateLimiter } from "./middleware/security.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import jobseekerRoutes from "./routes/jobseekerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// Set up __dirname support for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARE CONFIGURATION =================
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply Rate Limiter to all API routes
app.use("/api/", apiRateLimiter);

// Ensure upload folders exist
const uploadsDir = path.join(__dirname, "uploads");
const profilePhotosDir = path.join(uploadsDir, "profilePhotos");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(profilePhotosDir)) fs.mkdirSync(profilePhotosDir, { recursive: true });

// Serve static uploaded files
app.use("/uploads", express.static(uploadsDir));

// ================= API ROUTE REGISTRATIONS =================
app.get("/", (req, res) => {
  res.json({ success: true, message: "JPMS API Gateway Server is running 🚀" });
});

// Modular Routes
app.use("/api/auth", authRoutes);
app.use("/api", authRoutes); // Compatibility for /api/admin/login and /api/jobseeker/login
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobseeker", jobseekerRoutes);
app.use("/api/admin", adminRoutes);

// Contact Us Public API Route
import db from "./db.js";
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }
    await db.query(
      "INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, email, subject || "", message]
    );
    res.status(201).json({ success: true, message: "Contact message sent successfully" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ success: false, message: "Failed to send contact message" });
  }
});

// Newsletter Subscription Public Route
app.post("/api/newsletter/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const [existing] = await db.query("SELECT id FROM newsletter_subscribers WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: "Email is already subscribed" });
    }

    await db.query("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, NOW())", [email]);
    res.status(201).json({ success: true, message: "Subscribed to newsletter successfully!" });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ success: false, message: "Failed to subscribe to newsletter" });
  }
});

// Global 404 Fallback Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Global Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ JPMS Server running on port ${PORT}`);
});
