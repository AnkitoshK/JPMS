import React, { useState, useEffect } from 'react';
import {
  MdMenu,
  MdClose,
  MdWorkOutline
} from 'react-icons/md';

import { Link } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../../context/authContext';

import './navbar.css';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [appliedJobsCount, setAppliedJobsCount] = useState(0);

  const {
    jobseeker,
    jobseekerLogout
  } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // ================= FETCH APPLIED JOBS COUNT =================
  useEffect(() => {

    const fetchAppliedJobs = async () => {

      try {

        const token =
          localStorage.getItem("jobseekerToken");

        if (!token) return;

        const res = await API.get(
          "/jobseeker/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const applications =
          res.data.applications || [];

        setAppliedJobsCount(
          applications.length
        );

      } catch (err) {

        console.error(
          "Navbar applied jobs fetch error:",
          err
        );
      }
    };

    fetchAppliedJobs();

  }, [jobseeker]);

  // ================= MOBILE MENU =================
  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );

  }, []);

  return (

    <nav className="navbar">

      <div className="navbar-top">

        {/* LEFT LOGO */}
        <div className="navbar-left">

          <Link
            to="/"
            className="navbar-logo"
          >

            <span className="logo-icon">
              <MdWorkOutline size={24} />
            </span>

            <span className="jpms-text">
              &nbsp;TPPPL
            </span>

          </Link>

        </div>

        {/* CENTER TEXT */}
        <div className="navbar-center">

          <div className="line-container">

            <div className="moving-line">

              We Provide Jobs to jobseekers
              who want to work in any sector...

            </div>

          </div>

        </div>

        {/* RIGHT MENU */}
        <div className="navbar-right">

          <div
            className="hamburger"
            onClick={toggleMenu}
          >
            {menuOpen
              ? <MdClose />
              : <MdMenu />
            }
          </div>

          <ul
            className={`navbar-links ${menuOpen ? 'show' : ''
              }`}
          >

            <li>
              <Link to="/">
                Home
              </Link>
            </li>

            <li>
              <Link to="/jobs">
                Jobs
              </Link>
            </li>

            {/* APPLY WITH COUNT */}
            <li>

              {/* <Link to="/jobseeker/profile#applied-jobs"> */}
              <Link to="/applied-jobs">

                Applied Jobs

                {jobseeker && (
                  <span
                    style={{
                      marginLeft: "6px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 8px",
                      fontSize: "12px",
                    }}
                  >
                    {appliedJobsCount}
                  </span>
                )}

              </Link>

            </li>

            <li>
              <Link to="/contact">
                Contact
              </Link>
            </li>

            {/* USER LOGIN */}
            {jobseeker ? (

              <>
                <li>

                  <Link to="/jobseeker/profile">

                    Welcome,
                    {" "}
                    {jobseeker.name}

                  </Link>

                </li>

                <li>

                  <button
                    onClick={jobseekerLogout}
                    className="logout-btn"
                  >
                    Logout
                  </button>

                </li>
              </>

            ) : (

              <li className="dropdown">

                <span className="dropdown-toggle">
                  Login
                </span>

                <ul className="dropdown-menu">

                  <li>
                    <Link to="/admin">
                      Admin Login
                    </Link>
                  </li>

                  <li>
                    <Link to="/jobseeker-login">
                      Jobseeker Login
                    </Link>
                  </li>

                </ul>
              </li>
            )}

          </ul>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;