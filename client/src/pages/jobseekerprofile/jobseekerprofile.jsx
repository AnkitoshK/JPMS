import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import "./jobseekerprofile.css";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

function JobseekerProfile() {

  // ================= STATES =================

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [editing, setEditing] =
    useState(false);

  const [resumeFile,
    setResumeFile] =
    useState(null);

  const [photoFile,
    setPhotoFile] =
    useState(null);

  const [profileData,
    setProfileData] =
    useState({

      name: "",
      phone: "",
      skills: "",
      experience: "",
      education: "",
      location: "",

    });

  const token =
    localStorage.getItem(
      "jobseekerToken"
    );

  // ================= RESTORE USER =================

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "jobseekerUser"
      );

    if (savedUser) {

      setUser(
        JSON.parse(savedUser)
      );
    }

  }, []);

  // ================= FETCH PROFILE =================

  useEffect(() => {

    const fetchProfile =
      async () => {

        if (!token) {

          window.location.href =
            "/jobseeker-login";

          return;
        }

        try {

          const res =
            await API.get(
              "/jobseeker/profile",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const userData =
            res.data.user;

          // SAVE USER
          setUser(userData);

          // SAVE IN LOCALSTORAGE
          localStorage.setItem(
            "jobseekerUser",
            JSON.stringify(userData)
          );

          // PREFILL FORM
          setProfileData({

            name:
              userData.name || "",

            phone:
              userData.phone || "",

            skills:
              userData.skills || "",

            experience:
              userData.experience || "",

            education:
              userData.education || "",

            location:
              userData.location || "",

          });

        } catch (err) {

          console.error(
            "PROFILE FETCH ERROR:"
          );

          console.error(err);

          // TOKEN INVALID
          if (
            err.response?.status === 401
          ) {

            localStorage.removeItem(
              "jobseekerToken"
            );

            localStorage.removeItem(
              "jobseekerUser"
            );

            window.location.href =
              "/jobseeker-login";
          }

        } finally {

          setLoading(false);
        }
      };

    fetchProfile();

  }, [token]);

  // ================= UPDATE PROFILE =================

  const handleProfileUpdate =
    async () => {

      try {

        await API.put(

          "/jobseeker/update-profile",

          profileData,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const updatedUser = {

          ...user,
          ...profileData,
        };

        setUser(updatedUser);

        // SAVE UPDATED USER
        localStorage.setItem(
          "jobseekerUser",
          JSON.stringify(updatedUser)
        );

        alert(
          "Profile updated successfully"
        );

        setEditing(false);

      } catch (err) {

        console.error(err);

        alert(
          "Failed to update profile"
        );
      }
    };

  // ================= UPDATE PHOTO =================

  const handlePhotoUpload =
    async (e) => {

      e.preventDefault();

      if (!photoFile) {

        alert(
          "Please select image"
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "photo",
        photoFile
      );

      try {

        const res =
          await API.post(

            "/jobseeker/update-photo",

            formData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const updatedUser = {

          ...user,

          profilePhoto:
            res.data.photo,
        };

        setUser(updatedUser);

        // SAVE USER
        localStorage.setItem(
          "jobseekerUser",
          JSON.stringify(updatedUser)
        );

        alert(
          "Profile photo updated"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Photo upload failed"
        );
      }
    };

  // ================= UPDATE RESUME =================

  const handleResumeUpload =
    async (e) => {

      e.preventDefault();

      if (!resumeFile) {

        alert(
          "Please select resume"
        );

        return;
      }

      const formData =
        new FormData();

      formData.append(
        "resume",
        resumeFile
      );

      try {

        const res =
          await API.post(

            "/jobseeker/update-resume",

            formData,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        const updatedUser = {

          ...user,

          resume:
            res.data.resume,
        };

        setUser(updatedUser);

        // SAVE USER
        localStorage.setItem(
          "jobseekerUser",
          JSON.stringify(updatedUser)
        );

        alert(
          "Resume updated"
        );

      } catch (err) {

        console.error(err);

        alert(
          "Resume upload failed"
        );
      }
    };

  // ================= PROFILE SCORE =================

  const fields = [

    user?.name,
    user?.email,
    user?.phone,
    user?.skills,
    user?.experience,
    user?.education,
    user?.location,
    user?.resume,

  ];

  const completed =
    fields.filter(Boolean)
      .length;

  const profileScore =
    Math.round(
      (completed / fields.length)
      * 100
    );

  // ================= LOADING =================

  if (loading) {

    return (
      <div className="loading">
        Loading Profile...
      </div>
    );
  }

  // ================= UI =================

  return (

    <div className="naukri-profile-page">

      {/* LEFT SECTION */}

      <div className="left-section">

        {/* PROFILE CARD */}

        <div className="profile-card">

          <div className="profile-top">

            {/* PROFILE PHOTO */}

            <div>

              {
                user?.profilePhoto

                  ? (

                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="profile-photo"
                    />
                  )

                  : (

                    <div className="dummy-photo">

                      {
                        user?.name?.charAt(0)
                          ?.toUpperCase()
                      }

                    </div>
                  )
              }

            </div>

            {/* PROFILE DETAILS */}

            <div className="profile-basic">

              <h2>
                {user?.name}
              </h2>

              <p>

                {

                  user?.experience

                    ? Number(user.experience) < 1

                      ? `${Math.round(
                        Number(user.experience) * 12
                      )} Months Experience`

                      : `${user.experience} Years Experience`

                    : "Fresher"
                }

              </p>

              <p>

                📍 {

                  user?.location
                  || "Location not added"
                }

              </p>

            </div>

          </div>

          {/* PROFILE SCORE */}

          <div className="profile-score">

            <div className="score-header">

              <span>
                Profile Performance
              </span>

              <strong>
                {profileScore}%
              </strong>

            </div>

            <div className="score-bar">

              <div
                className="score-fill"
                style={{
                  width:
                    `${profileScore}%`,
                }}
              ></div>

            </div>

          </div>

          {/* EDIT BUTTON */}

          <div className="profile-actions">

            <button
              onClick={() =>
                setEditing(!editing)
              }
              className="edit-btn"
            >

              {
                editing
                  ? "Cancel"
                  : "Edit Profile"
              }

            </button>

          </div>

        </div>

        {/* EDIT PROFILE */}

        {
          editing && (

            <div className="edit-card">

              <h3>
                Edit Profile
              </h3>

              <input
                type="text"
                value={profileData.name}
                placeholder="Full Name"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    name:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                value={profileData.phone}
                placeholder="Phone"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phone:
                      e.target.value,
                  })
                }
              />

              <input
                type="text"
                value={profileData.location}
                placeholder="Location"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    location:
                      e.target.value,
                  })
                }
              />

              <textarea
                value={profileData.skills}
                placeholder="Skills"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    skills:
                      e.target.value,
                  })
                }
              />

              <textarea
                value={profileData.experience}
                placeholder="Experience in Years (Example: 2.5)"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    experience:
                      e.target.value,
                  })
                }
              />

              <textarea
                value={profileData.education}
                placeholder="Education"
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    education:
                      e.target.value,
                  })
                }
              />

              <button
                onClick={
                  handleProfileUpdate
                }
                className="save-btn"
              >

                Save Profile

              </button>

            </div>
          )
        }

        {/* RESUME */}

        <div className="resume-card">

          <div className="section-header">

            <h3>
              Resume Preview
            </h3>

          </div>

          {
            user?.resume

              ? (

                <iframe

                  // src={user.resume}
                  src={`http://localhost:5000/${user.resume}`}

                  title="Resume"

                  className="resume-preview"
                ></iframe>

              )

              : (

                <p>
                  No Resume Uploaded
                </p>
              )
          }

          <form
            onSubmit={
              handleResumeUpload
            }
            className="upload-form"
          >

            <input
              type="file"
              onChange={(e) =>
                setResumeFile(
                  e.target.files[0]
                )
              }
            />

            <button type="submit">

              Update Resume

            </button>

          </form>

        </div>

      </div>

      {/* RIGHT SECTION */}

      <div className="right-section">

        {/* QUICK INFO */}

        <div className="info-card">

          <h3>
            Quick Information
          </h3>

          <div className="info-row">

            <span>Email</span>

            <strong>
              {user?.email}
            </strong>

          </div>

          <div className="info-row">

            <span>Phone</span>

            <strong>
              {user?.phone || "N/A"}
            </strong>

          </div>

          <div className="info-row">

            <span>Location</span>

            <strong>
              {user?.location || "N/A"}
            </strong>

          </div>

        </div>

        {/* SKILLS */}

        <div className="info-card">

          <h3>
            Key Skills
          </h3>

          <div className="skills-wrapper">

            {
              user?.skills

                ? user.skills
                  .split(",")

                  .map((skill, index) => (

                    <span
                      key={index}
                      className="skill-tag"
                    >

                      {skill.trim()}

                    </span>
                  ))

                : (

                  <p>
                    No skills added
                  </p>
                )
            }

          </div>

        </div>

        {/* PHOTO UPDATE */}

        <div className="info-card">

          <h3>
            Update Profile Photo
          </h3>

          <form
            onSubmit={
              handlePhotoUpload
            }
            className="upload-form"
          >

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhotoFile(
                  e.target.files[0]
                )
              }
            />

            <button type="submit">

              Upload Photo

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default JobseekerProfile;