# JPMS – Job Portal Management System

A full-stack Job Portal Management System designed to connect **Job Seekers, Employers, and Administrators** through a centralized web platform.

JPMS provides a complete recruitment workflow where job seekers can create profiles, search and apply for jobs, while administrators can manage users, jobs, applications, and other platform activities.

---

## 📌 Project Overview

**JPMS (Job Portal Management System)** is a full-stack web application developed to simplify and digitize the recruitment process.

The system provides different functionalities based on user roles:

- 👨‍💼 Job Seekers
- 🏢 Employers / Recruiters
- 🛡️ Administrators

The platform manages the complete lifecycle of job posting and recruitment, starting from job creation and candidate registration to job application and application management.

---

# 🎯 Objectives

The main objectives of JPMS are:

- Provide a centralized job search platform.
- Allow job seekers to create and manage their profiles.
- Allow candidates to search and apply for jobs.
- Allow employers/admins to manage job postings.
- Manage job applications efficiently.
- Provide secure authentication and authorization.
- Reduce manual recruitment activities.
- Provide a scalable architecture for future enhancements.
- Maintain candidate and job-related information in a structured database.

---

# 🚀 Key Features

## 👤 Job Seeker Module

Job seekers can:

- Register an account.
- Login securely.
- Create and update their profile.
- Upload resumes.
- Search for available jobs.
- View job details.
- Apply for jobs.
- Track submitted applications.
- Manage their account.
- Reset forgotten passwords.

---

## 🏢 Employer / Job Management

The job management functionality includes:

- Create job postings.
- Update job postings.
- Delete job postings.
- View available jobs.
- Manage job requirements.
- Manage job descriptions.
- View candidates who applied for jobs.
- Manage application status.

---

## 🛡️ Admin Module

Administrators can manage the complete platform.

### Admin Authentication

- Admin registration.
- Admin login.
- JWT-based authentication.
- Token validation.
- Forgot password.
- Reset password.

### User Management

- View registered users.
- Manage job seekers.
- Manage employers.
- Monitor user activity.

### Job Management

- Add jobs.
- Update jobs.
- Delete jobs.
- View jobs.
- Manage job information.

### Application Management

- View applications.
- View candidate information.
- Track application status.
- Manage recruitment workflow.

---

# 🔐 Authentication & Security

JPMS uses **JWT (JSON Web Token)** based authentication.

Authentication flow:

```text
User Login
     │
     ▼
Credentials Validation
     │
     ▼
JWT Token Generated
     │
     ▼
Token Sent to Client
     │
     ▼
Client Stores Token
     │
     ▼
Protected API Request
     │
     ▼
Authorization Header
     │
     ▼
JWT Verification
     │
     ├── Valid → Continue
     │
     └── Invalid → 401 Unauthorized
