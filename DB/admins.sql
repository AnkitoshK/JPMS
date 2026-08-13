SELECT * FROM job_portal.admins;
use job_portal;

truncate admins;

INSERT INTO admins (name, email, password, created_at)
VALUES ('Ankitosh', 'ankitosh@example.com', '$2a$12$iDQKLiKcZarqd89F4eZS4.YDrM0mC/zv9zddTl0GKyoTsSIvDDlza', NOW());
