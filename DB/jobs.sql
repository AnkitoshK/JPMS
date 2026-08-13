CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  skills VARCHAR(500),
  description TEXT NOT NULL,
  category VARCHAR(100),
  location VARCHAR(100),
  salary_range VARCHAR(100),
  responsibilities TEXT,
  department VARCHAR(100),
  posted_by INT,
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES admins(id) ON DELETE SET NULL
);
desc jobs;

SELECT * FROM jobs;


 
