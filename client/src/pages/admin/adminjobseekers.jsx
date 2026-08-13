import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';
import { useNavigate } from 'react-router-dom';

const AdminJobseekers = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // show 2x2 grid initially
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobseekers = async () => {
      const token = sessionStorage.getItem('adminToken');

      if (!token) {
        // If token missing, redirect to admin login
        navigate('/admin/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/admin/jobseekers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobseekers(res.data);
      } catch (err) {
        console.error('Error fetching jobseekers:', err);
        setError('Failed to fetch jobseekers. Please login again.');
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobseekers();
  }, [navigate]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="jobseekers-container">
      <h2 className="jobseekers-title">Registered Jobseekers</h2>

      {loading ? (
        <p className="loading">Loading jobseekers...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : jobseekers.length === 0 ? (
        <p className="no-data">No jobseekers found.</p>
      ) : (
        <>
          <div className="jobseekers-grid">
            {jobseekers.slice(0, visibleCount).map((js) => (
              <div className="jobseeker-card" key={js.id}>
                <h3>{js.name}</h3>
                <p><strong>Email:</strong> {js.email}</p>
                <p><strong>Phone:</strong> {js.phone}</p>
                <p><strong>Skills:</strong> {js.skills}</p>
                <p><strong>Experience:</strong> {js.experience} yrs</p>
                <p>
                  <strong>Resume:</strong>{' '}
                  {js.resume ? (
                    <a
                      href={`http://localhost:5000/${js.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  ) : (
                    'N/A'
                  )}
                </p>
                <p className="timestamp">
                  Registered At: {new Date(js.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {visibleCount < jobseekers.length && (
            <div className="load-more-container">
              <button className="load-more-btn" onClick={handleLoadMore}>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminJobseekers;
