import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import axios from "axios";
import './admin.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboardHome = () => {
  const [monthlyApplications, setMonthlyApplications] = useState([]);
  const [departmentJobs, setDepartmentJobs] = useState([]);
  const [jobseekerRegistrations, setJobseekerRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const token = sessionStorage.getItem("adminToken");
        const token =
          localStorage.getItem(
            "adminToken"
          );
        if (!token) {
          setError("Authentication token missing. Please log in.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Backend URL - make sure this matches your backend server port
        const backendURL = "http://localhost:5000";

        const [appsRes, jobsRes, usersRes] = await Promise.all([
          axios.get(`${backendURL}/api/admin/applications-summary`, config),
          axios.get(`${backendURL}/api/admin/jobs-summary`, config),
          axios.get(`${backendURL}/api/admin/jobseeker-registrations`, config)
        ]);

        setMonthlyApplications(appsRes.data);
        setDepartmentJobs(jobsRes.data);
        setJobseekerRegistrations(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error">{error}</div>;

  // Calculate totals dynamically
  const totalApplications = monthlyApplications.reduce((sum, item) => sum + item.applications, 0);
  const totalJobs = departmentJobs.reduce((sum, item) => sum + item.jobs, 0);
  const totalJobseekers = jobseekerRegistrations.reduce((sum, item) => sum + item.users, 0);

  return (
    <div className="dashboard-home">
      <h2 className="dashboard-heading">📊 Admin Dashboard Overview</h2>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card applications">
          <h4>📥 Applications</h4>
          <p>{totalApplications}</p>
        </div>
        <div className="summary-card jobseekers">
          <h4>👤 Jobseekers</h4>
          <p>{totalJobseekers}</p>
        </div>
        <div className="summary-card jobs">
          <h4>💼 Jobs</h4>
          <p>{totalJobs}</p>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="chart-grid">
        <div className="chart-box">
          <h3>📈 Applications Per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>🏢 Department-wise Job Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentJobs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>👥 Jobseeker Registrations (Weekly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobseekerRegistrations}
                dataKey="users"
                nameKey="date"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {jobseekerRegistrations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
