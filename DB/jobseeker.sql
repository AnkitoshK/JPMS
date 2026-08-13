create database job_portal;

Use job_portal;

select * from job_portal.jobseekers;adminsadminsadmins

CREATE TABLE jobseekers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  skills TEXT,
  experience VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE jobseekers
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expires DATETIME;

ALTER TABLE jobseekers ADD COLUMN resume TEXT;



