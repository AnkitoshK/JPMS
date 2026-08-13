import db from "../db.js";

// Fetch All Jobs with Server-Side Search, Category/Location Filter & Pagination
export const getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { search, category, location, department } = req.query;

    let baseQuery = `FROM jobs j LEFT JOIN admins a ON j.posted_by = a.id WHERE 1=1`;
    const queryParams = [];

    if (search) {
      baseQuery += ` AND (j.title LIKE ? OR j.description LIKE ? OR j.skills LIKE ?)`;
      const term = `%${search}%`;
      queryParams.push(term, term, term);
    }

    if (category && category !== 'All' && category !== 'all') {
      baseQuery += ` AND j.category = ?`;
      queryParams.push(category);
    }

    if (location) {
      baseQuery += ` AND j.location LIKE ?`;
      queryParams.push(`%${location}%`);
    }

    if (department) {
      baseQuery += ` AND j.department = ?`;
      queryParams.push(department);
    }

    // Count total matching jobs for pagination meta
    const countSql = `SELECT COUNT(*) as total ${baseQuery}`;
    const [countResult] = await db.query(countSql, queryParams);
    const totalItems = countResult[0]?.total || 0;

    // Fetch paginated jobs
    const dataSql = `SELECT j.*, a.name as admin_name ${baseQuery} ORDER BY j.posted_at DESC LIMIT ? OFFSET ?`;
    const dataParams = [...queryParams, limit, offset];

    const [jobs] = await db.query(dataSql, dataParams);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit) || 1,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve jobs" });
  }
};

// Fetch Single Job Detail + Log View
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM jobs WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Job post not found" });
    }

    // Increment Job View Counter in background
    db.query("INSERT INTO job_views (job_id, viewed_at) VALUES (?, NOW())", [id]).catch(err => {
      console.error("Error logging job view:", err);
    });

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ success: false, message: "Server error fetching job details" });
  }
};

// Create New Job (Admin Only)
export const createJob = async (req, res) => {
  try {
    const { title, skills, description, category, location, salary_range, responsibilities, department } = req.body;
    const adminId = req.user?.id;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const [result] = await db.query(
      `INSERT INTO jobs (title, skills, description, category, location, salary_range, responsibilities, department, posted_by, posted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [title, skills || "", description, category || "", location || "", salary_range || "", responsibilities || "", department || "", adminId || null]
    );

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      jobId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
};

// Update Job (Admin Only)
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, skills, description, category, location, salary_range, responsibilities, department } = req.body;

    const [existing] = await db.query("SELECT id FROM jobs WHERE id = ?", [id]);
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await db.query(
      `UPDATE jobs 
       SET title=?, skills=?, description=?, category=?, location=?, salary_range=?, responsibilities=?, department=?
       WHERE id=?`,
      [title, skills, description, category, location, salary_range, responsibilities, department, id]
    );

    res.json({ success: true, message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: "Failed to update job" });
  }
};

// Delete Job (Admin Only)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM jobs WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};

// Fetch Unique Categories & Locations for Dynamic Filters
export const getJobFilterOptions = async (req, res) => {
  try {
    const [categories] = await db.query("SELECT DISTINCT category FROM jobs WHERE category IS NOT NULL AND category != ''");
    const [locations] = await db.query("SELECT DISTINCT location FROM jobs WHERE location IS NOT NULL AND location != ''");

    res.json({
      success: true,
      categories: categories.map(c => c.category),
      locations: locations.map(l => l.location),
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ success: false, message: "Failed to load filter options" });
  }
};
