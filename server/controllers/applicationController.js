import db from "../db.js";
import sendMail from "../config/sendMail.js";
import path from "path";
import fs from "fs";

// Submit New Job Application (Jobseeker)
export const submitApplication = async (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;
    const jobseeker_id = req.user?.id;

    if (!job_id) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    if (!jobseeker_id) {
      return res.status(401).json({ success: false, message: "Unauthorized jobseeker session" });
    }

    // Check if user already applied to this job
    const [existing] = await db.query(
      "SELECT id FROM applications WHERE job_id = ? AND jobseeker_id = ?",
      [job_id, jobseeker_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "You have already applied for this position" });
    }

    // Check for uploaded resume or fallback to existing jobseeker profile resume
    let resumePath = null;
    if (req.file) {
      resumePath = `uploads/${req.file.filename}`.replace(/\\/g, "/");
    } else {
      const [profile] = await db.query("SELECT resume FROM jobseekers WHERE id = ?", [jobseeker_id]);
      resumePath = profile[0]?.resume || null;
    }

    if (!resumePath) {
      return res.status(400).json({ success: false, message: "Please upload or attach a resume to submit application" });
    }

    await db.query(
      `INSERT INTO applications (job_id, jobseeker_id, cover_letter, resume, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [job_id, jobseeker_id, cover_letter || "", resumePath]
    );

    res.status(201).json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ success: false, message: "Failed to submit application" });
  }
};

// Fetch Applied Jobs for Logged-In Jobseeker
export const getJobseekerApplications = async (req, res) => {
  try {
    const jobseeker_id = req.user?.id;

    const [rows] = await db.query(
      `SELECT a.*, j.title as job_title, j.category, j.location, j.salary_range, j.department, j.skills as job_skills
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.jobseeker_id = ?
       ORDER BY a.created_at DESC`,
      [jobseeker_id]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching jobseeker applications:", error);
    res.status(500).json({ success: false, message: "Failed to load applied jobs" });
  }
};

// Fetch All Applications (Admin View with Filters)
export const getAllApplications = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT a.*, 
             j.title as job_title, j.category as job_category, j.location as job_location,
             js.name as seeker_name, js.email as seeker_email, js.phone as seeker_phone, js.skills as seeker_skills
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN jobseekers js ON a.jobseeker_id = js.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (j.title LIKE ? OR js.name LIKE ? OR js.email LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += ` ORDER BY a.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching admin applications:", error);
    res.status(500).json({ success: false, message: "Failed to load applications list" });
  }
};

// Update Application Status & Interview Scheduling + Automated Nodemailer Email
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, interview_date, interview_link, admin_notes } = req.body;

    const [existing] = await db.query(
      `SELECT a.*, j.title as job_title, js.name as candidate_name, js.email as candidate_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN jobseekers js ON a.jobseeker_id = js.id
       WHERE a.id = ?`,
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Application record not found" });
    }

    const appRecord = existing[0];

    await db.query(
      `UPDATE applications 
       SET status = ?, interview_date = ?, interview_link = ?, admin_notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, interview_date || null, interview_link || null, admin_notes || null, id]
    );

    // Send Automated Email Notification on Interview Schedule or Status Update
    if (status === 'interview_scheduled' && interview_date) {
      const emailSubject = `Interview Invitation for ${appRecord.job_title} - JPMS`;
      const formattedDate = new Date(interview_date).toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #1e293b; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #0284c7; margin-bottom: 10px;">Interview Scheduled!</h2>
          <p>Dear <strong>${appRecord.candidate_name}</strong>,</p>
          <p>Great news! You have been shortlisted for an interview for the <strong>${appRecord.job_title}</strong> position.</p>
          
          <div style="background-color: #ffffff; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>📅 Date & Time:</strong> ${formattedDate}</p>
            ${interview_link ? `<p style="margin: 5px 0;"><strong>🔗 Join Link:</strong> <a href="${interview_link}" style="color: #0284c7; font-weight: bold;">${interview_link}</a></p>` : ''}
            ${admin_notes ? `<p style="margin: 5px 0;"><strong>📝 Recruiter Note:</strong> ${admin_notes}</p>` : ''}
          </div>

          <p>Please make sure to log in 5 minutes prior to the scheduled time.</p>
          <p>Best regards,<br/>Recruitment Team<br/>Job Portal Management System</p>
        </div>
      `;

      sendMail(appRecord.candidate_email, emailSubject, emailHtml).catch(err => {
        console.error("Failed to send interview notification email:", err);
      });
    }

    res.json({ success: true, message: `Application status updated to ${status}` });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ success: false, message: "Failed to update application status" });
  }
};

// Secure Authenticated Download Route for Application Resume
export const downloadApplicationResume = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT resume FROM applications WHERE id = ?", [id]);
    if (!rows.length || !rows[0].resume) {
      return res.status(404).json({ success: false, message: "Resume file not found" });
    }

    const relativePath = rows[0].resume;
    const absolutePath = path.resolve(relativePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, message: "Physical resume file missing on server" });
    }

    res.download(absolutePath);
  } catch (error) {
    console.error("Error downloading resume:", error);
    res.status(500).json({ success: false, message: "Server error retrieving resume file" });
  }
};
