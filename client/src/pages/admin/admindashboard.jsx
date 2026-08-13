import React, { useState, useEffect } from 'react';
import './admin.css';
import AdminApplications from './adminapplications';
import AdminJobManager from './adminjobmanager';
import AdminJobseekers from './adminjobseekers';
import AdminDashboardHome from './admindashboardhome';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Get auth state from context
  const { adminLoggedIn, loading, adminLogout } = useAuth();

  console.log('AdminDashboard - adminLoggedIn:', adminLoggedIn, 'loading:', loading);

  // useEffect(() => {
  //   // Only check authentication after loading is complete
  //   if (!loading) {
  //     console.log('Auth loading complete. Admin logged in:', adminLoggedIn);

  //     if (!adminLoggedIn) {
  //       console.log('Admin not authenticated, redirecting to login...');
  //       toast.error('Session expired. Please log in again.');
  //       navigate('/admin/login', { replace: true });
  //       return;
  //     } else {
  //       console.log('Admin authenticated, staying on dashboard');
  //     }
  //   }
  // }, [adminLoggedIn, loading, navigate]);

  useEffect(() => {

    // WAIT UNTIL AUTH CHECK FINISHES

    if (loading) return;

    // CHECK TOKEN DIRECTLY

    const token =
      localStorage.getItem(
        "adminToken"
      );

    // NO TOKEN -> LOGIN

    if (!token) {

      toast.error(
        "Please login again"
      );

      navigate(
        "/admin/login",
        { replace: true }
      );

      return;
    }

    // VALID SESSION

    console.log(
      "Admin session restored"
    );

  }, [loading, navigate]);

  // Add history protection only after successful auth
  useEffect(() => {
    if (adminLoggedIn && !loading) {
      // Disable back navigation after login
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };

      return () => {
        window.onpopstate = null;
      };
    }
  }, [adminLoggedIn, loading]);

  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    phone: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleNewAdminChange = (e) => {
    const { name, value } = e.target;
    setNewAdminForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAdminForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!newAdminForm.name.trim()) errors.name = 'Name is required';
    if (!newAdminForm.phone) errors.phone = 'Phone number is required';
    else if (!phoneRegex.test(newAdminForm.phone)) errors.phone = 'Invalid Indian phone number';

    if (!newAdminForm.department.trim()) errors.department = 'Department is required';

    if (!newAdminForm.email) errors.email = 'Email is required';
    else if (!emailRegex.test(newAdminForm.email)) errors.email = 'Invalid email format';

    if (!newAdminForm.password) errors.password = 'Password is required';
    else if (newAdminForm.password.length < 6)
      errors.password = 'Password must be at least 6 characters';

    if (!newAdminForm.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (newAdminForm.password !== newAdminForm.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  const handleNewAdminSubmit = async (e) => {
    e.preventDefault();
    const errors = validateAdminForm();
    setFormErrors(errors);
    setSuccessMessage('');

    if (Object.keys(errors).length === 0) {
      try {
        // const token = sessionStorage.getItem('adminToken');
        const token = localStorage.getItem('adminToken');

        await axios.post(
          'http://localhost:5000/api/admin/register',
          {
            name: newAdminForm.name,
            phone: newAdminForm.phone,
            department: newAdminForm.department,
            email: newAdminForm.email,
            password: newAdminForm.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success('✅ Admin account created successfully');
        setSuccessMessage('Admin account created successfully ✅');

        setNewAdminForm({
          name: '',
          phone: '',
          department: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to create admin');
      }
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast.success("Logged out successfully");
    navigate('/admin/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardHome />;
      case 'applications':
        return <AdminApplications />;
      case 'jobs':
        return <AdminJobManager />;
      case 'jobseekers':
        return <AdminJobseekers />;
      case 'createadmin':
        return (
          <div className="create-admin-form">
            <h2>Create New Admin</h2>
            <form onSubmit={handleNewAdminSubmit} noValidate>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={newAdminForm.name}
                onChange={handleNewAdminChange}
              />
              {formErrors.name && <span className="error">{formErrors.name}</span>}

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={newAdminForm.phone}
                onChange={handleNewAdminChange}
              />
              {formErrors.phone && <span className="error">{formErrors.phone}</span>}

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={newAdminForm.department}
                onChange={handleNewAdminChange}
              />
              {formErrors.department && <span className="error">{formErrors.department}</span>}

              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={newAdminForm.email}
                onChange={handleNewAdminChange}
              />
              {formErrors.email && <span className="error">{formErrors.email}</span>}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newAdminForm.password}
                onChange={handleNewAdminChange}
              />
              {formErrors.password && <span className="error">{formErrors.password}</span>}

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={newAdminForm.confirmPassword}
                onChange={handleNewAdminChange}
              />
              {formErrors.confirmPassword && (
                <span className="error">{formErrors.confirmPassword}</span>
              )}

              <button type="submit">Create Admin</button>
              {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
          </div>
        );
      default:
        return <h2>Select an option from the sidebar.</h2>;
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #0066cc',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Verifying admin session...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <h2>Admin Panel</h2>
        <ul className="sidebar-links">
          <li onClick={() => setActiveTab('dashboard')}>Dashboard</li>
          <li onClick={() => setActiveTab('applications')}>Manage Applications</li>
          <li onClick={() => setActiveTab('jobs')}>Manage Jobs</li>
          <li onClick={() => setActiveTab('jobseekers')}>View Jobseekers</li>
          <li onClick={() => setActiveTab('createadmin')}>Create Admin</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      <section className="main-content">{renderContent()}</section>
    </div>
  );
};

export default AdminDashboard;
