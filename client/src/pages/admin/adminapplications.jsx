import React, {
  useEffect,
  useState
} from 'react';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import toast from 'react-hot-toast';

import { useAuth }
  from '../../context/authContext';

import './admin.css';

const AdminApplications = () => {

  const navigate = useNavigate();

  const { adminLoggedIn } =
    useAuth();

  const [applications,
    setApplications] = useState([]);

  const [loading,
    setLoading] = useState(true);

  // ================= FETCH APPLICATIONS =================

  const fetchApplications =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const res = await axios.get(
          'http://localhost:5000/api/admin/applications',
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setApplications(
          res.data
        );

      } catch (err) {

        console.error(
          'Error fetching applications:',
          err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ================= INITIAL FETCH =================

  useEffect(() => {

    if (!adminLoggedIn) {

      navigate('/admin/login');

      return;
    }

    fetchApplications();

  }, [adminLoggedIn, navigate]);

  // ================= UPDATE STATUS =================

  // ================= UPDATE STATUS =================

  const updateStatus = async (
    applicationId,
    status
  ) => {

    try {

      const token =
        localStorage.getItem(
          'adminToken'
        );

      // LOADING TOAST
      const toastId =
        toast.loading(
          `Updating application...`
        );

      // API CALL
      const res = await axios.put(

        `http://localhost:5000/api/admin/application-status/${applicationId}`,

        { status },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Status Update Response:"
      );

      console.log(res.data);

      // UPDATE UI INSTANTLY
      setApplications((prevApps) =>

        prevApps.map((app) =>

          app.id === applicationId

            ? {
              ...app,
              status,
            }
            : app
        )
      );

      // SUCCESS TOAST
      toast.success(

        `Application ${status} successfully & mail sent`,

        {
          id: toastId,
        }
      );

    } catch (err) {

      console.error(
        "STATUS UPDATE ERROR:"
      );

      console.error(err);

      // ERROR TOAST
      toast.error(

        err.response?.data?.message
        || "Failed to update status",

        {
          duration: 4000,
        }
      );
    }
  };

  return (

    <div className="admin-page">

      <h2>
        Job Applications
      </h2>

      {loading ? (

        <p>
          Loading applications...
        </p>

      ) : applications.length === 0 ? (

        <p>
          No applications found.
        </p>

      ) : (

        <div className="data-list">

          {applications.map((app) => (

            <div
              key={app.id}
              className="data-card"
            >

              {/* APPLICANT */}

              <p>
                <strong>
                  Applicant:
                </strong>
                {" "}
                {app.jobseeker_name}
              </p>

              {/* EMAIL */}

              <p>
                <strong>
                  Email:
                </strong>
                {" "}
                {app.jobseeker_email}
              </p>

              {/* JOB */}

              <p>
                <strong>
                  Applied For:
                </strong>
                {" "}
                {app.job_title}
                {" "}
                ({app.location})
              </p>

              {/* STATUS */}

              <p>
                <strong>
                  Status:
                </strong>
                {" "}

                <span
                  style={{
                    color:

                      app.status === "approved"
                        ? "green"

                        : app.status === "rejected"
                          ? "red"

                          : "orange",

                    fontWeight: "bold",
                  }}
                >
                  {app.status}
                </span>

              </p>

              {/* COVER LETTER */}

              <p>
                <strong>
                  Cover Letter:
                </strong>
                {" "}
                {app.cover_letter}
              </p>

              {/* RESUME */}

              <a
                href={`http://localhost:5000/${app.resume}`}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>

              {/* DATE */}

              <p className="timestamp">

                Applied on:
                {" "}

                {
                  new Date(
                    app.created_at
                  ).toLocaleString()
                }

              </p>

              {/* ACTION BUTTONS */}

              <div className="actions">

                {/* APPROVE */}

                <button
                  className="approve-btn"

                  onClick={() =>
                    updateStatus(
                      app.id,
                      "approved"
                    )
                  }

                  disabled={
                    app.status === "approved" ||
                    app.status === "rejected"
                  }

                  style={{
                    opacity:
                      app.status === "approved" ||
                        app.status === "rejected"
                        ? 0.5
                        : 1,

                    cursor:
                      app.status === "approved" ||
                        app.status === "rejected"
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Approve
                </button>

                {/* REJECT */}

                <button
                  className="reject-btn"

                  onClick={() =>
                    updateStatus(
                      app.id,
                      "rejected"
                    )
                  }

                  disabled={
                    app.status === "approved" ||
                    app.status === "rejected"
                  }

                  style={{
                    opacity:
                      app.status === "approved" ||
                        app.status === "rejected"
                        ? 0.5
                        : 1,

                    cursor:
                      app.status === "approved" ||
                        app.status === "rejected"
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Reject
                </button>

                {/* HOLD */}

                <button
                  className="hold-btn"

                  onClick={() =>
                    updateStatus(
                      app.id,
                      "hold"
                    )
                  }

                  disabled={
                    app.status === "approved" ||
                    app.status === "rejected"
                  }

                  style={{
                    opacity:
                      app.status === "approved" ||
                        app.status === "rejected"
                        ? 0.5
                        : 1,

                    cursor:
                      app.status === "approved" ||
                        app.status === "rejected"
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Hold
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AdminApplications;