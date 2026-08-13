SELECT * FROM job_portal.applications;

ALTER TABLE applications
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
