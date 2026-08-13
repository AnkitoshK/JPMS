import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "./appliedjobs.css";
import { Calendar, Video, FileText, CheckCircle2, Clock, XCircle, AlertCircle, Building2, MapPin } from "lucide-react";

function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Applied Jobs
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        // Attempt fetch from dedicated applications endpoint, fallback to profile applications
        let apps = [];
        try {
          const res = await API.get("/applications/my-applications");
          apps = res.data.data || res.data.applications || [];
        } catch (err) {
          const profileRes = await API.get("/jobseeker/profile");
          apps = profileRes.data.profile?.applications || profileRes.data.applications || [];
        }

        setApplications(apps);
        setFilteredApplications(apps);
      } catch (err) {
        console.error("Applied jobs fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Search Filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApplications(applications);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = applications.filter(
        (app) =>
          (app.title || app.job_title || "").toLowerCase().includes(lower) ||
          (app.location || "").toLowerCase().includes(lower) ||
          (app.category || "").toLowerCase().includes(lower)
      );
      setFilteredApplications(filtered);
    }
  }, [searchTerm, applications]);

  // Helper to Render Timeline Status Steps
  const renderStatusTimeline = (status) => {
    const currentStatus = (status || 'pending').toLowerCase();
    
    if (currentStatus === 'rejected') {
      return (
        <div className="status-timeline rejected-timeline">
          <div className="timeline-step completed">
            <span className="step-dot">✓</span>
            <span className="step-label">Applied</span>
          </div>
          <div className="timeline-line completed"></div>
          <div className="timeline-step rejected">
            <XCircle size={16} />
            <span className="step-label">Application Rejected</span>
          </div>
        </div>
      );
    }

    const steps = [
      { key: 'pending', label: 'Applied' },
      { key: 'under_review', label: 'Under Review' },
      { key: 'shortlisted', label: 'Shortlisted' },
      { key: 'interview_scheduled', label: 'Interview Scheduled' },
      { key: 'offered', label: 'Offered' },
    ];

    const getStepIndex = (st) => {
      switch (st) {
        case 'pending': return 0;
        case 'under_review': case 'hold': return 1;
        case 'shortlisted': return 2;
        case 'interview_scheduled': return 3;
        case 'offered': return 4;
        default: return 0;
      }
    };

    const currentIndex = getStepIndex(currentStatus);

    return (
      <div className="status-timeline">
        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <React.Fragment key={step.key}>
              <div className={`timeline-step ${isDone ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="step-dot">{isDone ? '✓' : idx + 1}</div>
                <span className="step-label">{step.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`timeline-line ${idx < currentIndex ? 'completed' : ''}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const st = (status || 'pending').toLowerCase();
    switch (st) {
      case 'interview_scheduled':
        return <span className="status-badge badge-interview"><Calendar size={14} /> Interview Scheduled</span>;
      case 'shortlisted':
        return <span className="status-badge badge-shortlisted"><CheckCircle2 size={14} /> Shortlisted</span>;
      case 'offered':
        return <span className="status-badge badge-offered"><CheckCircle2 size={14} /> Offered</span>;
      case 'under_review':
        return <span className="status-badge badge-review"><Clock size={14} /> Under Review</span>;
      case 'rejected':
        return <span className="status-badge badge-rejected"><XCircle size={14} /> Rejected</span>;
      case 'hold':
        return <span className="status-badge badge-hold"><AlertCircle size={14} /> On Hold</span>;
      default:
        return <span className="status-badge badge-pending"><Clock size={14} /> Pending</span>;
    }
  };

  if (loading) {
    return <div className="loading-container">Loading your applied positions...</div>;
  }

  return (
    <div className="applied-jobs-page">
      {/* HEADER */}
      <div className="applied-header">
        <div>
          <h2>My Applied Jobs</h2>
          <p className="subtitle">Track your job applications, interview schedules, and response progress.</p>
        </div>
        <span className="jobs-count">{applications.length} Total Applications</span>
      </div>

      {/* SEARCH */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search by job title, category, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* LIST */}
      {filteredApplications.length === 0 ? (
        <div className="no-jobs">
          <FileText size={48} className="empty-icon" />
          <h3>No Applied Jobs Found</h3>
          <p>Explore open positions on our jobs page and apply to kickstart your career!</p>
        </div>
      ) : (
        <div className="jobs-container">
          {filteredApplications.map((app) => (
            <div key={app.id} className="job-card">
              <div className="card-top">
                <div>
                  <h3 className="job-title">{app.title || app.job_title || "Position Applied"}</h3>
                  <div className="meta-row">
                    <span><MapPin size={14} /> {app.location || "Remote / Various"}</span>
                    {app.category && <span><Building2 size={14} /> {app.category}</span>}
                    <span>💰 {app.salary_range || "Disclosed in interview"}</span>
                  </div>
                </div>
                <div>{getStatusBadge(app.status)}</div>
              </div>

              {/* TIMELINE PROGRESS */}
              <div className="timeline-wrapper">
                {renderStatusTimeline(app.status)}
              </div>

              {/* INTERVIEW CARD DETAILS */}
              {app.status === 'interview_scheduled' && (
                <div className="interview-card">
                  <div className="interview-header">
                    <Calendar size={18} />
                    <h4>Upcoming Interview Details</h4>
                  </div>
                  <div className="interview-body">
                    {app.interview_date && (
                      <p>
                        <strong>📅 Scheduled Date & Time:</strong>{" "}
                        {new Date(app.interview_date).toLocaleString("en-US", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })}
                      </p>
                    )}
                    {app.interview_link && (
                      <p className="link-row">
                        <strong>🔗 Meeting Link:</strong>{" "}
                        <a href={app.interview_link} target="_blank" rel="noopener noreferrer" className="btn-join-meeting">
                          <Video size={14} /> Join Video Interview
                        </a>
                      </p>
                    )}
                    {app.admin_notes && (
                      <p className="notes-box">
                        <strong>📝 Note from Recruiter:</strong> {app.admin_notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* FOOTER META */}
              <div className="card-bottom">
                <span>
                  Applied on: {app.created_at ? new Date(app.created_at).toLocaleDateString("en-IN") : "Recently"}
                </span>
                {app.cover_letter && (
                  <details className="cover-letter-toggle">
                    <summary>View Cover Letter</summary>
                    <p className="cover-text">{app.cover_letter}</p>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppliedJobs;