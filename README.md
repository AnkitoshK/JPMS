# 💼 JPMS – Job Portal Management System

A full-stack **Job Portal Management System** designed to connect **Job Seekers, Employers, and Administrators** through a centralized recruitment platform.

JPMS provides a complete recruitment workflow where job seekers can create profiles, search and apply for jobs, while employers and administrators can manage job postings, candidates, applications, and recruitment activities.

---

## 📌 Project Overview

**JPMS (Job Portal Management System)** is a full-stack web application developed to simplify and digitize the recruitment process.

The system provides role-based functionality for:

* 👨‍💼 **Job Seekers**
* 🏢 **Employers / Recruiters**
* 🛡️ **Administrators**

The platform manages the complete lifecycle of recruitment, starting from user registration and job creation to job applications and application management.

### Recruitment Workflow

```text
Job Seeker
    │
    ├── Register / Login
    │
    ├── Create Profile
    │
    ├── Upload Resume
    │
    ├── Search Jobs
    │
    ├── View Job Details
    │
    └── Apply for Job
             │
             ▼
       Job Application
             │
             ▼
     Employer / Admin
             │
             ├── Review Candidate
             ├── View Resume
             └── Update Application Status
```

---

# 🎯 Objectives

The main objectives of JPMS are:

* Provide a centralized job search and recruitment platform.
* Allow job seekers to create and manage professional profiles.
* Allow candidates to search and apply for jobs.
* Allow employers to create and manage job postings.
* Provide efficient application management.
* Implement secure authentication and authorization.
* Reduce manual recruitment activities.
* Provide role-based access control.
* Maintain candidate, employer, job, and application information in a structured database.
* Provide a scalable architecture for future enhancements.
* Simplify communication between candidates and recruiters.

---

# 🚀 Key Features

## 👤 Job Seeker Module

Job seekers can:

* Register an account.
* Login securely.
* Logout securely.
* Create a professional profile.
* Update personal information.
* Upload resumes.
* Search available jobs.
* Filter jobs.
* View complete job details.
* Apply for jobs.
* Track submitted applications.
* View application status.
* Manage account information.
* Reset forgotten passwords.

---

## 🏢 Employer / Recruiter Module

Employers and recruiters can:

* Register and login.
* Create job postings.
* Update job postings.
* Delete job postings.
* View published jobs.
* Manage job descriptions.
* Manage job requirements.
* Define job location.
* Define employment type.
* Define required skills.
* View candidates who applied.
* View candidate information.
* Review submitted resumes.
* Manage application status.

---

# 🛡️ Admin Module

Administrators have access to platform-level management functionality.

## 🔐 Admin Authentication

* Admin registration.
* Admin login.
* JWT-based authentication.
* JWT token validation.
* Forgot password functionality.
* Reset password functionality.
* Protected admin APIs.

## 👥 User Management

Administrators can:

* View registered users.
* View job seekers.
* View employers.
* Manage user accounts.
* Monitor registered users.
* Manage user roles.

## 💼 Job Management

Administrators can:

* Add jobs.
* Update jobs.
* Delete jobs.
* View jobs.
* Manage job information.
* Monitor job postings.

## 📄 Application Management

Administrators can:

* View applications.
* View candidate information.
* View applied jobs.
* Track application status.
* Manage recruitment workflow.

---

# 🔐 Authentication & Security

JPMS uses **JWT (JSON Web Token)** based authentication to secure protected APIs.

### Authentication Flow

```text
              User Login
                   │
                   ▼
          Credentials Validation
                   │
              ┌────┴────┐
              │         │
           Invalid     Valid
              │         │
              ▼         ▼
         401 Error   Generate JWT
                        │
                        ▼
                  Send Token
                        │
                        ▼
                 Client Application
                        │
                        ▼
              Protected API Request
                        │
                        ▼
              Authorization Header
                        │
                        ▼
                  JWT Verification
                   │          │
                Invalid      Valid
                   │          │
                   ▼          ▼
              401 Error    Continue
```

### JWT Header

Protected API requests use:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Security Features

* JWT authentication.
* Password hashing.
* Token validation.
* Protected routes.
* Role-based authorization.
* Unauthorized request handling.
* Secure API endpoints.

---

# 🏗️ System Architecture

JPMS follows a layered full-stack architecture.

```text
┌───────────────────────────────────────────┐
│               USER INTERFACE              │
│                                           │
│                React.js                  │
│                                           │
│  Job Seeker │ Employer │ Administrator    │
└──────────────────────┬────────────────────┘
                       │
                       │ HTTP / REST API
                       ▼
┌───────────────────────────────────────────┐
│                BACKEND API                │
│                                           │
│                 Node.js                  │
│                     +                    │
│                Express.js                │
│                                           │
│  Routes │ Controllers │ Middleware       │
│  Authentication │ Authorization          │
└──────────────────────┬────────────────────┘
                       │
                       │ SQL Queries
                       ▼
┌───────────────────────────────────────────┐
│                  DATABASE                 │
│                                           │
│          Microsoft SQL Server             │
│                  MSSQL                    │
│                                           │
│ Users │ Jobs │ Applications │ Profiles   │
└───────────────────────────────────────────┘
```

---

# 🛠️ Technology Stack

JPMS is developed using a modern full-stack JavaScript architecture.

## Frontend

### React.js

Used for:

* Building reusable UI components.
* Creating dynamic pages.
* Managing frontend state.
* Implementing role-based dashboards.
* Communicating with backend REST APIs.

### HTML5

Used for application structure and semantic markup.

### CSS3

Used for:

* UI styling.
* Layout.
* Responsive design.
* Component styling.

---

## Backend

### Node.js

Node.js provides the server-side JavaScript runtime for JPMS.

Used for:

* Backend application execution.
* API processing.
* Database communication.
* Authentication processing.

### Express.js

Express.js is used as the backend web framework.

Used for:

* REST API development.
* Routing.
* Middleware.
* Authentication middleware.
* Authorization.
* Request/response handling.
* Error handling.

---

## Database

### Microsoft SQL Server (MSSQL)

MSSQL is used as the relational database.

It stores:

* User information.
* Job seeker profiles.
* Employer information.
* Job postings.
* Job applications.
* Application status.
* Authentication-related information.

---

## Authentication

* JWT – JSON Web Token
* Password Hashing
* Role-Based Access Control

---

## Development Tools

* Git
* GitHub
* Visual Studio Code
* Node.js
* npm
* Microsoft SQL Server
* SQL Server Management Studio (SSMS)
* Postman

---

# 📂 Project Structure

The project is organized into separate frontend and backend applications.

```text
JPMS/
│
├── client/
│   │
│   ├── public/
│   │
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── assets/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   │
│   ├── config/
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .gitignore
├── README.md
└── package.json
```

> The exact structure may vary depending on the current implementation.

---

# 🗄️ Database Design

JPMS uses **Microsoft SQL Server** as its relational database.

A simplified database relationship can be represented as:

```text
                    ┌──────────────┐
                    │    USERS     │
                    ├──────────────┤
                    │ UserID       │
                    │ Name         │
                    │ Email        │
                    │ Password     │
                    │ Role         │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌───────────────┐     ┌───────────────┐
        │ JOB_SEEKER    │     │   EMPLOYER    │
        ├───────────────┤     ├───────────────┤
        │ SeekerID      │     │ EmployerID    │
        │ UserID        │     │ UserID        │
        │ Skills        │     │ CompanyName   │
        │ Resume        │     │ CompanyInfo   │
        └───────┬───────┘     └───────┬───────┘
                │                     │
                │                     │
                │              ┌──────▼───────┐
                │              │     JOBS     │
                │              ├──────────────┤
                │              │ JobID        │
                │              │ EmployerID   │
                │              │ Title        │
                │              │ Description   │
                │              │ Requirements │
                │              └──────┬───────┘
                │                     │
                └──────────┬──────────┘
                           ▼
                    ┌───────────────┐
                    │ APPLICATIONS  │
                    ├───────────────┤
                    │ ApplicationID │
                    │ JobID         │
                    │ SeekerID      │
                    │ AppliedDate   │
                    │ Status        │
                    └───────────────┘
```

---

# 🔄 Application Workflow

## Job Seeker Workflow

```text
Register
   │
   ▼
Login
   │
   ▼
Create Profile
   │
   ▼
Upload Resume
   │
   ▼
Search Jobs
   │
   ▼
View Job Details
   │
   ▼
Apply
   │
   ▼
Application Submitted
   │
   ▼
Track Application
```

---

## Employer Workflow

```text
Register / Login
       │
       ▼
Employer Dashboard
       │
       ▼
Create Job
       │
       ▼
Publish Job
       │
       ▼
Receive Applications
       │
       ▼
View Candidates
       │
       ▼
Review Resume
       │
       ▼
Update Application Status
```

---

## Admin Workflow

```text
Admin Login
     │
     ▼
Admin Dashboard
     │
     ├───────────────┐
     │               │
     ▼               ▼
User Management   Job Management
     │               │
     └───────┬───────┘
             ▼
      Application Management
             │
             ▼
       Platform Monitoring
```

---

# 🌐 REST API Architecture

The backend exposes RESTful APIs that are consumed by the React.js frontend.

Example API structure:

```text
/api
 │
 ├── /auth
 │    ├── POST /register
 │    ├── POST /login
 │    ├── POST /forgot-password
 │    └── POST /reset-password
 │
 ├── /users
 │    ├── GET /
 │    ├── GET /:id
 │    ├── PUT /:id
 │    └── DELETE /:id
 │
 ├── /jobs
 │    ├── GET /
 │    ├── GET /:id
 │    ├── POST /
 │    ├── PUT /:id
 │    └── DELETE /:id
 │
 └── /applications
      ├── GET /
      ├── GET /:id
      ├── POST /
      └── PUT /:id/status
```

---

# 📡 API Request Flow

```text
React.js
    │
    │ HTTP Request
    ▼
Express.js Router
    │
    ▼
Authentication Middleware
    │
    ▼
Authorization Middleware
    │
    ▼
Controller
    │
    ▼
Service / Database Layer
    │
    ▼
Microsoft SQL Server
    │
    ▼
Response
    │
    ▼
React.js
```

---

# ⚙️ Installation & Setup

## Prerequisites

Before running JPMS, install:

* Node.js
* npm
* Microsoft SQL Server
* SQL Server Management Studio (SSMS)
* Git
* Visual Studio Code
* Postman (optional)

---

# 📥 Clone Repository

```bash
git clone https://github.com/AnkitoshK/JPMS.git
```

Navigate to the project:

```bash
cd JPMS
```

---

# 📦 Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

DB_SERVER=localhost
DB_DATABASE=JPMS
DB_USER=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_jwt_secret
```

> Never commit `.env` files or database passwords to GitHub.

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

Backend server:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🗃️ Database Setup

## Step 1 – Create Database

Open SQL Server Management Studio and execute:

```sql
CREATE DATABASE JPMS;
```

Select the database:

```sql
USE JPMS;
```

## Step 2 – Create Tables

Execute the project's database schema scripts.

Example:

```sql
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Role VARCHAR(30) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
```

Additional tables can include:

```text
Users
JobSeekers
Employers
Jobs
Applications
Resumes
```

---

# 🔑 Role-Based Access Control

JPMS provides different permissions based on user roles.

| Role          | Main Permissions                                |
| ------------- | ----------------------------------------------- |
| Job Seeker    | Profile, Search Jobs, Apply, Track Applications |
| Employer      | Create Jobs, Manage Jobs, View Candidates       |
| Administrator | Users, Jobs, Applications, Platform Management  |

Example:

```text
                 JPMS
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
   Job Seeker  Employer   Admin
        │         │         │
        ▼         ▼         ▼
     Apply     Post Jobs  Manage
     Jobs      Candidates  Platform
```

---

# 📊 Application Status

The recruitment workflow can use statuses such as:

```text
Applied
   │
   ▼
Under Review
   │
   ├───────────────┐
   ▼               ▼
Shortlisted      Rejected
   │
   ▼
Interview
   │
   ├───────────────┐
   ▼               ▼
Selected         Rejected
```

---

# 🧪 Testing

API testing can be performed using **Postman**.

Example:

```http
POST /api/auth/login
```

Request:

```json
{
    "email": "user@example.com",
    "password": "yourpassword"
}
```

Successful response:

```json
{
    "success": true,
    "message": "Login successful",
    "token": "<JWT_TOKEN>"
}
```

The returned JWT can then be used for protected endpoints.

---

# 📈 Future Enhancements

The following features can be added in future versions:

* 🔔 Real-time notifications.
* 💬 Candidate-Recruiter chat.
* 📧 Email notifications.
* 📱 Mobile application.
* 🤖 AI-based resume screening.
* 🤖 AI-powered job recommendations.
* 🔎 Advanced job search.
* 📊 Recruitment analytics dashboard.
* 📄 Resume parsing.
* 🎯 Skill-based job matching.
* 📅 Interview scheduling.
* ⭐ Candidate ratings.
* 🏢 Company profiles.
* 🔐 Two-factor authentication.
* ☁️ Cloud deployment.
* 🐳 Docker containerization.
* ⚡ Redis caching.
* 🔄 CI/CD using GitHub Actions.

---

# 🤖 Potential AI Integration

JPMS can be extended with AI-powered recruitment capabilities.

Possible AI features:

```text
Candidate Resume
       │
       ▼
   AI Resume Parser
       │
       ▼
 Extract Skills
       │
       ▼
 Compare With Job
 Requirements
       │
       ▼
 Match Score
       │
       ▼
 Recommended Jobs
```

Potential AI functionality:

* Resume analysis.
* Skill extraction.
* Candidate-job matching.
* Job recommendations.
* Resume scoring.
* Automated job description generation.
* Candidate ranking.

---

# 🐳 Deployment Architecture

A future production architecture can be:

```text
                    Internet
                       │
                       ▼
                React Frontend
                       │
                       ▼
                Node.js Server
                       │
                  Express.js
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
          JWT Auth         REST APIs
                                │
                                ▼
                       Microsoft SQL Server
```

The application can later be deployed using:

* Docker
* CI/CD
* Cloud infrastructure
* Reverse proxy
* Production database
* Environment-based configuration

---

# 📁 Environment Variables

The following environment variables should be configured:

```env
PORT=5000

DB_SERVER=localhost
DB_DATABASE=JPMS
DB_USER=your_database_user
DB_PASSWORD=your_database_password

JWT_SECRET=your_secret_key
```

Do not commit sensitive credentials.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
.env.local
dist/
build/
```

---

# 🔒 Security Best Practices

JPMS follows security practices such as:

* JWT-based authentication.
* Password hashing.
* Protected API routes.
* Role-based authorization.
* Environment variables for secrets.
* Input validation.
* Proper HTTP status codes.
* Secure database access.
* Error handling.
* Restricted administrative endpoints.

---

# 📋 Project Status

**Current Status:** 🚧 Under Development

The core project architecture and authentication functionality are being developed incrementally.

Future development will focus on:

* Job seeker functionality.
* Employer functionality.
* Application management.
* Admin dashboard.
* Advanced search.
* Recruitment analytics.
* AI-powered features.

---

# 👨‍💻 Developer

### Ankitosh Kumar

Full Stack Developer

**GitHub:**
https://github.com/AnkitoshK

**Project Repository:**
https://github.com/AnkitoshK/JPMS

---

# 📊 Project Technology Summary

```text
┌───────────────────────────────────────┐
│               JPMS                    │
├───────────────────────────────────────┤
│                                       │
│  Frontend     → React.js              │
│                                       │
│  Backend      → Node.js               │
│                 Express.js            │
│                                       │
│  Database     → Microsoft SQL Server  │
│                 (MSSQL)               │
│                                       │
│  Security     → JWT                   │
│                                       │
│  API          → REST API              │
│                                       │
│  Version Ctrl → Git + GitHub           │
│                                       │
└───────────────────────────────────────┘
```

---

# ⭐ Why JPMS?

JPMS is designed as a practical full-stack recruitment platform demonstrating:

* Modern frontend development with React.js.
* Backend development using Node.js and Express.js.
* RESTful API architecture.
* Relational database management using Microsoft SQL Server.
* JWT authentication.
* Role-based authorization.
* CRUD operations.
* Recruitment workflow management.
* Scalable application architecture.

The project also provides a foundation for integrating **AI-powered recruitment, real-time communication, analytics, and cloud deployment** in future versions.

---

# 📜 License

This project is developed for **learning, portfolio, and demonstration purposes**.

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
