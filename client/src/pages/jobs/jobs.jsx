// src/pages/jobs/Jobs.jsx

import React, { useState, useEffect } from 'react';
import './jobs.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [jobIdToApply, setJobIdToApply] = useState(null);

  const jobsPerPage = 5;

  useEffect(() => {
    API.get('/jobs').then(res => {
      const parsed = res.data.map(job => ({
        ...job,
        responsibilities: job.responsibilities.split(',').map(s => s.trim())
      }));
      setJobs(parsed);
      localStorage.setItem('jobsList', JSON.stringify(parsed));
    });
  }, []);

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  // const handleApply = id => {
  //   if (!localStorage.getItem('token')) {
  //     setJobIdToApply(id);
  //     setShowLoginPrompt(true);
  //   } else {
  //     navigate(`/apply?id=${id}`);
  //   }
  // };

  const handleApply = id => {
    const token = localStorage.getItem("jobseekerToken");
    const isLoggedIn = localStorage.getItem("jobseekerLoggedIn") === "true";

    if (!token || !isLoggedIn) {
      setJobIdToApply(id);
      setShowLoginPrompt(true);
    } else {
      navigate(`/apply?id=${id}`);
    }
  };

  return (
    <div className="jobs-page-split">
      <div className="jobs-left">
        <h2>Job Openings</h2>
        {currentJobs.map(job => (
          <div key={job.id} id={`job-${job.id}`} className={`job-card ${selectedJob?.id === job.id ? 'active' : ''}`} onClick={() => setSelectedJob(job)}>
            <h3>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Company:</strong> {job.department}</p>
          </div>
        ))}
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>⏪</button>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>▶</button>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>⏩</button>
        </div>
      </div>

      <div className="jobs-right">
        {selectedJob ? (
          <div className="job-details">
            <h2>{selectedJob.title}</h2>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Category:</strong> {selectedJob.category}</p>
            <p><strong>Salary:</strong> {selectedJob.salary_range}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <h4>Responsibilities:</h4>
            <ul>{selectedJob.responsibilities.map((r, i) => <li key={i}>✓ {r}</li>)}</ul>
            <button className="apply-btn" onClick={() => handleApply(selectedJob.id)}>Apply Now</button>
          </div>
        ) : (
          <div className="placeholder">
            <p>Click a job to view details</p>
          </div>
        )}
      </div>

      {showLoginPrompt && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Login Required</h3>
            <p>Please login to apply.</p>
            <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
            <button
              onClick={() => {
                setShowLoginPrompt(false);
                navigate(
                  `/jobseeker-login?redirect=${encodeURIComponent(`/apply?id=${jobIdToApply}`)}`
                );
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
