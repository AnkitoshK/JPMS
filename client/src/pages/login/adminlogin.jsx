import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import "./adminlogin.css";

import toast from "react-hot-toast";

import { useAuth }
  from "../../context/authContext";

function Adminlogin() {

  const navigate =
    useNavigate();

  const { adminLogin } =
    useAuth();

  // ================= STATES =================

  const [mode, setMode] =
    useState("login");

  const [formData, setFormData] =
    useState({

      email: "",
      password: "",

      otp: "",
      newPassword: "",

    });

  const [errors, setErrors] =
    useState({});

  const [submitting,
    setSubmitting] =
    useState(false);

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));
  };

  // ================= VALIDATION =================

  const validate = () => {

    const errs = {};

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // EMAIL

    if (!formData.email) {

      errs.email =
        "Email is required";
    }

    else if (
      !emailRegex.test(
        formData.email
      )
    ) {

      errs.email =
        "Enter valid email";
    }

    // LOGIN PASSWORD

    if (mode === "login") {

      if (!formData.password) {

        errs.password =
          "Password is required";
      }

      else if (
        formData.password.length < 6
      ) {

        errs.password =
          "Minimum 6 characters";
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
      }

      else if (
        formData.newPassword.length < 6
      ) {

        errs.newPassword =
          "Minimum 6 characters";
      }
    }

    return errs;
  };

  // ================= SUBMIT =================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      const errs =
        validate();

      setErrors(errs);

      if (
        Object.keys(errs).length
      ) return;

      try {

        setSubmitting(true);

        // ================= LOGIN =================

        if (mode === "login") {

          const result =
            await adminLogin(

              formData.email,

              formData.password
            );

          if (
            result &&
            (
              result.success
              || result.token
            )
          ) {

            toast.success(
              "Admin logged in successfully"
            );

            navigate(
              "/admin/dashboard",
              {
                replace: true
              }
            );

          } else {

            toast.error(
              result?.error
              || "Login failed"
            );
          }
        }

        // ================= FORGOT PASSWORD =================

        else if (
          mode === "forgot"
        ) {

          const res =
            await axios.post(

              "http://localhost:5000/api/admin/forgot-password",

              {
                email:
                  formData.email,
              }
            );

          toast.success(
            res.data.message
            || "OTP sent"
          );

          // MOVE TO RESET SCREEN

          setMode("reset");
        }

        // ================= RESET PASSWORD =================

        else if (
          mode === "reset"
        ) {

          const res =
            await axios.post(

              "http://localhost:5000/api/admin/reset-password",

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
            || "Password reset successful"
          );

          // CLEAR FORM

          setFormData({

            email: "",
            password: "",

            otp: "",
            newPassword: "",
          });

          // BACK TO LOGIN

          setMode("login");
        }

      } catch (err) {

        console.error(err);

        toast.error(

          err?.response?.data?.message
          || "Something went wrong"
        );

      } finally {

        setSubmitting(false);
      }
    };

  // ================= UI =================

  return (

    <div className="admin-auth-container">

      <div className="auth-card">

        <h2>

          {
            mode === "login"
              ? "Admin Login"

              : mode === "forgot"
                ? "Forgot Password"

                : "Reset Password"
          }

        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* EMAIL */}

          <input
            type="email"

            name="email"

            placeholder="Email Address"

            value={formData.email}

            onChange={handleChange}
          />

          {
            errors.email && (

              <span className="error">

                {errors.email}

              </span>
            )
          }

          {/* LOGIN PASSWORD */}

          {
            mode === "login" && (

              <>
                <input
                  type="password"

                  name="password"

                  placeholder="Password"

                  value={formData.password}

                  onChange={handleChange}
                />

                {
                  errors.password && (

                    <span className="error">

                      {errors.password}

                    </span>
                  )
                }
              </>
            )
          }

          {/* RESET SCREEN */}

          {
            mode === "reset" && (

              <>

                {/* OTP */}

                <input
                  type="text"

                  name="otp"

                  placeholder="Enter OTP"

                  value={formData.otp}

                  onChange={handleChange}
                />

                {
                  errors.otp && (

                    <span className="error">

                      {errors.otp}

                    </span>
                  )
                }

                {/* NEW PASSWORD */}

                <input
                  type="password"

                  name="newPassword"

                  placeholder="New Password"

                  value={formData.newPassword}

                  onChange={handleChange}
                />

                {
                  errors.newPassword && (

                    <span className="error">

                      {errors.newPassword}

                    </span>
                  )
                }

              </>
            )
          }

          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >

            {
              submitting

                ? "Processing..."

                : mode === "login"

                  ? "Login"

                  : mode === "forgot"

                    ? "Send OTP"

                    : "Reset Password"
            }

          </button>

        </form>

        {/* TOGGLE LINKS */}

        <div className="toggle-text">

          {
            mode === "login" && (

              <p>

                <span
                  className="forgot-link"

                  onClick={() =>
                    setMode("forgot")
                  }
                >

                  Forgot Password?

                </span>

              </p>
            )
          }

          {
            mode === "forgot" && (

              <p>

                Remembered password?{" "}

                <span
                  onClick={() =>
                    setMode("login")
                  }
                >

                  Back to login

                </span>

              </p>
            )
          }

          {
            mode === "reset" && (

              <p>

                Back to{" "}

                <span
                  onClick={() =>
                    setMode("login")
                  }
                >

                  Login

                </span>

              </p>
            )
          }

        </div>

      </div>

    </div>
  );
}

export default Adminlogin;