import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './apply.css';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

function Apply() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const jobId = parseInt(searchParams.get('id'), 10);

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: '',
  });
  const [resumeFile, setResumeFile] = useState(null); // File or "EXISTS"
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check login & fetch user profile
  useEffect(() => {
    const token = localStorage.getItem('jobseekerToken');

    if (!token) {
      navigate(
        `/jobseeker-login?redirect=${encodeURIComponent(location.pathname + location.search)}`
      );
      return;
    }
    // const token = localStorage.getItem('jobseekerToken');
    // const isLoggedIn = localStorage.getItem('jobseekerLoggedIn') === 'true';

    // if (!isLoggedIn || !token) {
    //   navigate(`/jobseeker-login?redirect=/apply?id=${jobId}`);
    //   return;
    // }

    API.get('/jobseeker/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const user = res.data.user;
        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
        }));
        if (user.resume) {
          setResumeFile('EXISTS'); // Means resume already uploaded
        }
      })
      .catch(() => {
        navigate('/jobseeker');
      });
  }, [navigate, jobId]);

  // Load job details
  useEffect(() => {
    const localJobs = JSON.parse(localStorage.getItem('jobsList')) || [];
    const selected = localJobs.find((j) => j.id === jobId);

    if (selected) {
      setJob(selected);
    } else {
      setJob({
        title: 'Unknown Job',
        company: 'N/A',
        location: 'N/A',
        salary: 'N/A',
        category: 'N/A',
        description: 'This job could not be found.',
        responsibilities: [],
      });
    }
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jobseekerToken');
    const userId = localStorage.getItem('jobseekerId');
    console.log({
      token,
      userId,
      jobId
    });
    if (!token || !userId) {
      alert("Session expired. Please login again.");
      navigate('/jobseeker');
      return;
    }

    if (!resumeFile) {
      alert("Please upload your resume before submitting.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append('job_id', jobId);
    formPayload.append('user_id', userId);
    formPayload.append('cover_letter', formData.coverLetter);

    // Only include resume if uploading a new one
    if (resumeFile !== 'EXISTS') {
      formPayload.append('resume', resumeFile);
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        body: formPayload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', coverLetter: '' });
        setResumeFile(null);
        setTimeout(() => {
          setSuccess(false);
          navigate('/jobseeker/profile');
        }, 3000);
      } else {
        alert(result.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert("Server error during submission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apply-wrapper">
      <main className="apply-content">
        {!job || job.title === 'Unknown Job' ? (
          <div className="apply-page not-found">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5231/5231019.png"
              alt="Lost Jobseeker"
              className="cartoon-img"
            />
            <h2>Oops! You haven't selected a job yet.</h2>
            <p>Please go back and select a job before applying.</p>
            <button onClick={() => navigate('/jobs')}>🔍 Browse Jobs</button>
          </div>
        ) : (
          <div className="apply-page">
            <h1>Apply for: {job.title}</h1>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Category:</strong> {job.category}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <h4>Responsibilities:</h4>
            <ul>
              {job.responsibilities.length > 0 ? (
                job.responsibilities.map((res, index) => (
                  <li key={index}>✓ {res}</li>
                ))
              ) : (
                <li>No responsibilities listed</li>
              )}
            </ul>

            <form className="apply-form" onSubmit={handleSubmit}>
              <h3>Submit Your Application</h3>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="coverLetter"
                placeholder="Cover Letter"
                rows="5"
                value={formData.coverLetter}
                onChange={handleChange}
                required
              ></textarea>
              {resumeFile === 'EXISTS' ? (
                <p>✅ Resume already uploaded in your profile.</p>
              ) : (
                <label>
                  Upload Resume:
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              )}
              {resumeFile && resumeFile.name && <p>Selected file: {resumeFile.name}</p>}
              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>

              {success && (
                <div className="success-message">
                  ✅ Your application has been submitted!
                </div>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Apply;
