import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';
import './admin.css'; // Make sure this CSS file is created

const getToken = () => sessionStorage.getItem('adminToken');

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function AdminJobManager() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    salary_range: '',
    responsibilities: '',
    department: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Fetch jobs failed:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/admin/update-job/${editingId}`, form);
      } else {
        await API.post('/admin/post-job', form);
      }
      setForm({
        title: '',
        description: '',
        category: '',
        location: '',
        salary_range: '',
        responsibilities: '',
        department: '',
      });
      setEditingId(null);
      fetchJobs();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleEdit = (job) => {
    setForm({ ...job });
    setEditingId(job.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await API.delete(`/admin/delete-job/${id}`);
        fetchJobs();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="admin-job-container">
      <div className="admin-grid">
        {/* Job Form */}
        <div className="form-section">
          <h2>{editingId ? '✏️ Edit Job Posting' : '➕ Add New Job'}</h2>
          <form onSubmit={handleSubmit} className="job-form">
            {['title', 'location', 'salary_range', 'category', 'department'].map((field) => (
              <div key={field} className="form-group">
                <label>{field.replace('_', ' ')}</label>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Responsibilities</label>
              <textarea
                name="responsibilities"
                value={form.responsibilities}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Job' : 'Post Job'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      title: '',
                      description: '',
                      category: '',
                      location: '',
                      salary_range: '',
                      responsibilities: '',
                      department: '',
                    });
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Job List */}
        <div className="list-section">
          <h2>📋 Job Listings</h2>
          <div className="job-list">
            {jobs.length === 0 ? (
              <p className="no-jobs">No jobs posted yet.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="card-header">
                    <div>
                      <h3>{job.title}</h3>
                      <div className="tags">
                        <span className="tag blue">{job.location}</span>
                        <span className="tag green">{job.category}</span>
                        <span className="tag yellow">{job.department}</span>
                      </div>
                    </div>
                    <div className="actions">
                      <button onClick={() => handleEdit(job)} title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(job.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="job-description">
                    {job.description.length > 100 ? `${job.description.slice(0, 100)}...` : job.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminJobManager;
