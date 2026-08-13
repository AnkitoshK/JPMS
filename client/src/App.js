import './App.css';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';

import Home from './pages/home/home';
import Jobs from './pages/jobs/jobs';
import Apply from './pages/apply/apply';

import Adminlogin from './pages/login/adminlogin';
import Jobseeker from './pages/login/jobseeker';

import Contact from './pages/contact/contact';

import JobseekerProfile from './pages/jobseekerprofile/jobseekerprofile';

/* ✅ NEW PAGE IMPORT */
import AppliedJobs from './pages/appliedjobs/appliedjobs';

/* ADMIN */
import AdminDashboard from './pages/admin/admindashboard';
import AdminApplications from './pages/admin/adminapplications';
import AdminJobManager from './pages/admin/adminjobmanager';
import AdminJobseekers from './pages/admin/adminjobseekers';

import { Toaster } from 'react-hot-toast';

import { useAuth } from './context/authContext';


// ================= APPLY PROTECTION =================
const ProtectedApplyRoute = () => {

  const { jobseeker } = useAuth();

  const location = useLocation();

  const searchParams =
    new URLSearchParams(location.search);

  const jobId =
    searchParams.get('id');

  return jobseeker ? (

    <Apply />

  ) : (

    <Navigate
      to={`/jobseeker-login?redirect=/apply?id=${jobId}`}
      replace
    />
  );
};


// ================= ADMIN PROTECTION =================
const ProtectedAdminRoute = ({
  children
}) => {

  const {
    adminLoggedIn,
    loading
  } = useAuth();

  if (loading) {

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '20px'
        }}
      >

        <div
          style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #0066cc',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        ></div>

        <p>
          Checking admin authentication...
        </p>

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

  return adminLoggedIn
    ? children
    : <Navigate to="/admin/login" replace />;
};


// ================= JOBSEEKER PROTECTION =================
const ProtectedJobseekerRoute = ({
  children
}) => {

  const {
    jobseeker,
    loading
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!jobseeker) {

    const currentPath =
      location.pathname + location.search;

    return (
      <Navigate
        to={`/jobseeker-login?redirect=${encodeURIComponent(currentPath)}`}
        replace
      />
    );
  }

  return children;
};


// ================= APP =================
function App() {

  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith('/admin') &&
    location.pathname !== '/admin/login';

  return (

    <div className="App">

      {!isAdminRoute && <Navbar />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000
        }}
      />

      <main className="App-main">

        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/jobs"
            element={<Jobs />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/apply"
            element={<ProtectedApplyRoute />}
          />

          <Route
            path="/admin/login"
            element={<Adminlogin />}
          />

          <Route
            path="/jobseeker-login"
            element={<Jobseeker />}
          />

          <Route
            path="/admin"
            element={<Navigate to="/admin/login" />}
          />


          {/* ================= JOBSEEKER ================= */}

          <Route
            path="/jobseeker/profile"
            element={
              <ProtectedJobseekerRoute>
                <JobseekerProfile />
              </ProtectedJobseekerRoute>
            }
          />

          {/* ✅ NEW APPLIED JOBS PAGE */}
          <Route
            path="/applied-jobs"
            element={
              <ProtectedJobseekerRoute>
                <AppliedJobs />
              </ProtectedJobseekerRoute>
            }
          />


          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/applications"
            element={
              <ProtectedAdminRoute>
                <AdminApplications />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/jobs"
            element={
              <ProtectedAdminRoute>
                <AdminJobManager />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="/admin/jobseekers"
            element={
              <ProtectedAdminRoute>
                <AdminJobseekers />
              </ProtectedAdminRoute>
            }
          />


          {/* ================= FALLBACK ================= */}

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

        </Routes>

      </main>

      {!isAdminRoute && <Footer />}

    </div>
  );
}

export default App;