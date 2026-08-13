-- Migration Script 001: JPMS Database Enhancements & Indexes
-- Database: job_portal

USE job_portal;

-- 1. Indexing for Search & Query Optimization
ALTER TABLE jobs ADD INDEX idx_jobs_category (category);
ALTER TABLE jobs ADD INDEX idx_jobs_location (location);
ALTER TABLE jobs ADD INDEX idx_jobs_department (department);
ALTER TABLE jobs ADD INDEX idx_jobs_posted_at (posted_at);

ALTER TABLE applications ADD INDEX idx_app_jobseeker (jobseeker_id);
ALTER TABLE applications ADD INDEX idx_app_job (job_id);
ALTER TABLE applications ADD INDEX idx_app_status (status);

-- 2. Applications Table ENUM Expansion & Interview Scheduling Fields
ALTER TABLE applications 
MODIFY COLUMN status ENUM(
  'pending', 
  'under_review', 
  'shortlisted', 
  'interview_scheduled', 
  'offered', 
  'rejected', 
  'hold'
) DEFAULT 'pending';

-- Add Interview & Notes columns if they do not exist
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS interview_date DATETIME NULL AFTER status,
ADD COLUMN IF NOT EXISTS interview_link VARCHAR(550) NULL AFTER interview_date,
ADD COLUMN IF NOT EXISTS admin_notes TEXT NULL AFTER interview_link,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- 3. Password Resets Table
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  token VARCHAR(255) NOT NULL,
  user_type ENUM('admin', 'jobseeker') NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reset_token (token),
  INDEX idx_reset_email (email)
);
