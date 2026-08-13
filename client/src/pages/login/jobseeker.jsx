import React, { useState } from "react";

import { toast }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

import axios from "axios";

import { useAuth }
from "../../context/authContext";

import "./jobseeker.css";

const API = axios.create({

  baseURL:
    "http://localhost:5000/api/jobseeker",

});

function Jobseeker() {

  // ================= MODE =================

  const [mode, setMode] =
    useState("login");

  // ================= FORM =================

  const [formData,
    setFormData] =
    useState({

      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      skills: "",
      experience: "",
      resume: null,

      // OTP RESET

      otp: "",
      newPassword: "",

    });

  // ================= STATES =================

  const [errors,
    setErrors] =
    useState({});

  const [message,
    setMessage] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const searchParams =
    new URLSearchParams(
      useLocation().search
    );

  const redirectPath =
    searchParams.get(
      "redirect"
    );

  const {
    jobseekerLogin
  } = useAuth();

  // ================= HANDLE CHANGE =================

  const handleChange =
    (e) => {

      const {
        name,
        value,
        files
      } = e.target;

      setFormData((prev) => ({

        ...prev,

        [name]:
          files
            ? files[0]
            : value,

      }));
    };

  // ================= VALIDATION =================

  const validate =
    () => {

      const errs = {};

      // EMAIL

      if (!formData.email) {

        errs.email =
          "Email is required";

      } else if (

        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(formData.email)

      ) {

        errs.email =
          "Invalid email format";
      }

      // LOGIN / REGISTER PASSWORD

      if (
        mode === "login"
        ||
        mode === "register"
      ) {

        if (!formData.password) {

          errs.password =
            "Password is required";

        } else if (

          formData.password.length < 6

        ) {

          errs.password =
            "Minimum 6 characters";
        }
      }

      // REGISTER

      if (mode === "register") {

        if (!formData.name.trim()) {

          errs.name =
            "Name is required";
        }

        if (
          !/^\d{10}$/
            .test(formData.phone)
        ) {

          errs.phone =
            "Phone must be 10 digits";
        }

        if (!formData.skills.trim()) {

          errs.skills =
            "Skills are required";
        }

        if (
          !formData.experience.trim()
        ) {

          errs.experience =
            "Experience is required";
        }

        if (

          formData.password
          !==
          formData.confirmPassword

        ) {

          errs.confirmPassword =
            "Passwords do not match";
        }

        if (!formData.resume) {

          errs.resume =
            "Resume is required";
        }
      }

      // RESET MODE

      if (mode === "reset") {

        if (!formData.otp) {

          errs.otp =
            "OTP is required";
        }

        if (!formData.newPassword) {

          errs.newPassword =
            "New password required";

        } else if (

          formData.newPassword.length < 6

        ) {

          errs.newPassword =
            "Minimum 6 characters";
        }
      }

      return errs;
    };

  // ================= HANDLE SUBMIT =================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setErrors({});
      setMessage("");

      const validationErrors =
        validate();

      if (
        Object.keys(validationErrors)
          .length > 0
      ) {

        return setErrors(
          validationErrors
        );
      }

      setLoading(true);

      try {

        // ================= LOGIN =================

        if (mode === "login") {

  const { data } =
    await API.post(
      "/login",
      {
        email: formData.email,
        password: formData.password,
      }
    );

  const { token, user } =
    data;

  // CLEAR OLD USER DATA

  localStorage.removeItem(
    "jobseekerToken"
  );

  localStorage.removeItem(
    "jobseekerUser"
  );

  localStorage.removeItem(
    "jobseekerLoggedIn"
  );

  // SAVE NEW LOGIN DATA

  localStorage.setItem(
    "jobseekerToken",
    token
  );

  localStorage.setItem(
    "jobseekerUser",
    JSON.stringify(user)
  );

  localStorage.setItem(
    "jobseekerLoggedIn",
    "true"
  );

  // CONTEXT LOGIN

  await jobseekerLogin(
    token,
    user
  );

  toast.success(
    "Login successful"
  );

  // REDIRECT

  if (redirectPath) {

    navigate(
      redirectPath,
      { replace: true }
    );

  } else {

    navigate(
      "/jobseeker/profile",
      { replace: true }
    );
  }
}

        // ================= REGISTER =================

        if (mode === "register") {

          const form =
            new FormData();

          form.append(
            "name",
            formData.name
          );

          form.append(
            "email",
            formData.email
          );

          form.append(
            "password",
            formData.password
          );

          form.append(
            "phone",
            formData.phone
          );

          form.append(
            "skills",
            formData.skills
          );

          form.append(
            "experience",
            formData.experience
          );

          form.append(
            "resume",
            formData.resume
          );

          await API.post(

            "/register",

            form,

            {
              headers: {

                "Content-Type":
                  "multipart/form-data",

              },
            }
          );

          toast.success(
            "Registered successfully"
          );

          switchMode("login");
        }

        // ================= FORGOT PASSWORD =================

        if (mode === "forgot") {

          const res =
            await API.post(

              "/forgot-password",

              {
                email:
                  formData.email,
              }
            );

          toast.success(
            res.data.message
          );

          // SWITCH SCREEN

          setMode("reset");
        }

        // ================= RESET PASSWORD =================

        if (mode === "reset") {

          const res =
            await API.post(

              "/reset-password",

              {

                email:
                  formData.email,

                otp:
                  formData.otp,

                password:
                  formData.newPassword,

              }
            );

          toast.success(
            res.data.message
          );

          switchMode("login");
        }

      } catch (err) {

        console.error(err);

        setMessage(

          err.response?.data?.message
          || "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  // ================= SWITCH MODE =================

  const switchMode =
    (m) => {

      setMode(m);

      setFormData({

        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        skills: "",
        experience: "",
        resume: null,

        otp: "",
        newPassword: "",

      });

      setErrors({});
      setMessage("");
    };

  // ================= UI =================

  return (

    <div className="jobseeker-auth-container">

      <div className="auth-card">

        <h2>

          {
            mode === "login"
            &&
            "Jobseeker Login"
          }

          {
            mode === "register"
            &&
            "Jobseeker Registration"
          }

          {
            mode === "forgot"
            &&
            "Forgot Password"
          }

          {
            mode === "reset"
            &&
            "Reset Password"
          }

        </h2>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >

          {/* REGISTER */}

          {
            mode === "register"
            && (

              <>

                <input
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />

                {
                  errors.name
                  &&
                  <span className="error">
                    {errors.name}
                  </span>
                }

                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {
                  errors.phone
                  &&
                  <span className="error">
                    {errors.phone}
                  </span>
                }

                <input
                  name="skills"
                  placeholder="Skills"
                  value={formData.skills}
                  onChange={handleChange}
                />

                {
                  errors.skills
                  &&
                  <span className="error">
                    {errors.skills}
                  </span>
                }

                <input
                  name="experience"
                  placeholder="Experience"
                  value={formData.experience}
                  onChange={handleChange}
                />

                {
                  errors.experience
                  &&
                  <span className="error">
                    {errors.experience}
                  </span>
                }

                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleChange}
                />

                {
                  errors.resume
                  &&
                  <span className="error">
                    {errors.resume}
                  </span>
                }

              </>
            )
          }

          {/* EMAIL */}

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          {
            errors.email
            &&
            <span className="error">
              {errors.email}
            </span>
          }

          {/* LOGIN / REGISTER PASSWORD */}

          {
            (
              mode === "login"
              ||
              mode === "register"
            )

            && (

              <>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />

                {
                  errors.password
                  &&
                  <span className="error">
                    {errors.password}
                  </span>
                }

              </>
            )
          }

          {/* REGISTER CONFIRM PASSWORD */}

          {
            mode === "register"
            && (

              <>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                {
                  errors.confirmPassword
                  &&
                  <span className="error">
                    {
                      errors.confirmPassword
                    }
                  </span>
                }

              </>
            )
          }

          {/* RESET PASSWORD */}

          {
            mode === "reset"
            && (

              <>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />

                {
                  errors.otp
                  &&
                  <span className="error">
                    {errors.otp}
                  </span>
                }

                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />

                {
                  errors.newPassword
                  &&
                  <span className="error">
                    {errors.newPassword}
                  </span>
                }

              </>
            )
          }

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >

            {
              loading

                ? "Processing..."

                : mode === "login"

                  ? "Login"

                  : mode === "register"

                    ? "Register"

                    : mode === "forgot"

                      ? "Send OTP"

                      : "Reset Password"
            }

          </button>

        </form>

        {/* MESSAGE */}

        {
          message
          &&
          <p className="message">
            {message}
          </p>
        }

        {/* TOGGLE LINKS */}

        {
          mode === "login"
          && (

            <>

              <p className="toggle-text">

                Forgot your password?

                {" "}

                <span
                  onClick={() =>
                    switchMode("forgot")
                  }
                >
                  Reset here
                </span>

              </p>

              <p className="toggle-text">

                Don't have an account?

                {" "}

                <span
                  onClick={() =>
                    switchMode("register")
                  }
                >
                  Register here
                </span>

              </p>

            </>
          )
        }

        {
          mode === "register"
          && (

            <p className="toggle-text">

              Already have an account?

              {" "}

              <span
                onClick={() =>
                  switchMode("login")
                }
              >
                Login here
              </span>

            </p>
          )
        }

        {
          (
            mode === "forgot"
            ||
            mode === "reset"
          )

          && (

            <p className="toggle-text">

              Back to

              {" "}

              <span
                onClick={() =>
                  switchMode("login")
                }
              >
                Login
              </span>

            </p>
          )
        }

      </div>

    </div>
  );
}

export default Jobseeker;