import db from "../db.js";

// Fetch Admin Dashboard Stats & Metrics
export const getDashboardStats = async (req, res) => {
  try {
    const [[jobsCount]] = await db.query("SELECT COUNT(*) as totalJobs FROM jobs");
    const [[seekersCount]] = await db.query("SELECT COUNT(*) as totalJobseekers FROM jobseekers");
    const [[appsCount]] = await db.query("SELECT COUNT(*) as totalApplications FROM applications");
    const [[viewsCount]] = await db.query("SELECT COUNT(*) as totalViews FROM job_views");

    // Breakdown by Application Status
    const [statusBreakdown] = await db.query(
      "SELECT status, COUNT(*) as count FROM applications GROUP BY status"
    );

    // Recent 5 Applications
    const [recentApplications] = await db.query(`
      SELECT a.id, a.status, a.created_at, j.title as job_title, js.name as seeker_name, js.email as seeker_email
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN jobseekers js ON a.jobseeker_id = js.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        totalJobs: jobsCount?.totalJobs || 0,
        totalJobseekers: seekersCount?.totalJobseekers || 0,
        totalApplications: appsCount?.totalApplications || 0,
        totalViews: viewsCount?.totalViews || 0,
        statusBreakdown,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Error loading admin dashboard metrics:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard metrics" });
  }
};

// Fetch All Registered Jobseekers
export const getAllJobseekers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = "SELECT id, name, email, phone, skills, experience, created_at FROM jobseekers WHERE 1=1";
    const params = [];

    if (search) {
      query += " AND (name LIKE ? OR email LIKE ? OR skills LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    query += " ORDER BY created_at DESC";

    const [jobseekers] = await db.query(query, params);
    res.json({ success: true, data: jobseekers });
  } catch (error) {
    console.error("Error fetching jobseekers:", error);
    res.status(500).json({ success: false, message: "Failed to load jobseekers list" });
  }
};

// Delete Jobseeker Account
export const deleteJobseeker = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM jobseekers WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Jobseeker record not found" });
    }

    res.json({ success: true, message: "Jobseeker account deleted successfully" });
  } catch (error) {
    console.error("Error deleting jobseeker:", error);
    res.status(500).json({ success: false, message: "Failed to delete jobseeker" });
  }
};

// Fetch Contact Messages
export const getContactMessages = async (req, res) => {
  try {
    const [messages] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ success: false, message: "Failed to load contact messages" });
  }
};
