import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext =
  createContext();

export const AuthProvider =
  ({ children }) => {

    // ================= STATES =================

    const [
      adminLoggedIn,
      setAdminLoggedIn,
    ] = useState(false);

    const [
      jobseeker,
      setJobseeker,
    ] = useState(null);

    const [
      loading,
      setLoading,
    ] = useState(true);

    // ================= INITIAL AUTH CHECK =================

    useEffect(() => {

      const initializeAuth =
        async () => {

          try {

            // ================= ADMIN SESSION =================

            const adminToken =
              localStorage.getItem(
                "adminToken"
              );

            const adminLoginTime =
              localStorage.getItem(
                "adminLoginTime"
              );

            if (adminToken) {

              const currentTime =
                Date.now();

              const loginTime =
                adminLoginTime
                  ? parseInt(
                    adminLoginTime
                  )
                  : 0;

              // 24 HOURS

              const SESSION_TIMEOUT =
                24
                * 60
                * 60
                * 1000;

              // VALID SESSION

              if (
                !loginTime
                ||
                currentTime - loginTime
                < SESSION_TIMEOUT
              ) {

                try {

                  await axios.get(

                    "http://localhost:5000/api/admin/validate",

                    {
                      headers: {
                        Authorization:
                          `Bearer ${adminToken}`,
                      },
                    }
                  );

                  setAdminLoggedIn(
                    true
                  );

                  // UPDATE LOGIN TIME

                  localStorage.setItem(

                    "adminLoginTime",

                    currentTime.toString()
                  );

                  console.log(
                    "Admin session restored"
                  );

                } catch (err) {

                  console.error(
                    "Admin token invalid:",
                    err
                  );

                  // REMOVE ONLY ADMIN KEYS

                  localStorage.removeItem(
                    "adminToken"
                  );

                  localStorage.removeItem(
                    "adminLoggedIn"
                  );

                  localStorage.removeItem(
                    "adminId"
                  );

                  localStorage.removeItem(
                    "adminLoginTime"
                  );

                  setAdminLoggedIn(
                    false
                  );
                }

              } else {

                console.log(
                  "Admin session expired"
                );

                localStorage.removeItem(
                  "adminToken"
                );

                localStorage.removeItem(
                  "adminLoggedIn"
                );

                localStorage.removeItem(
                  "adminId"
                );

                localStorage.removeItem(
                  "adminLoginTime"
                );

                setAdminLoggedIn(
                  false
                );
              }
            }

            // ================= JOBSEEKER SESSION =================

            const jobseekerToken =
              localStorage.getItem(
                "jobseekerToken"
              );

            if (jobseekerToken) {

              try {

                const res =
                  await axios.get(

                    "http://localhost:5000/api/jobseeker/profile",

                    {
                      headers: {
                        Authorization:
                          `Bearer ${jobseekerToken}`,
                      },
                    }
                  );

                setJobseeker(
                  res.data.user
                );

                console.log(
                  "Jobseeker session restored"
                );

              } catch (err) {

                console.error(
                  "Jobseeker token invalid:",
                  err
                );

                // REMOVE ONLY JOBSEEKER KEYS

                localStorage.removeItem(
                  "jobseekerLoggedIn"
                );

                localStorage.removeItem(
                  "jobseekerToken"
                );

                localStorage.removeItem(
                  "jobseekerUser"
                );

                localStorage.removeItem(
                  "jobseekerId"
                );

                setJobseeker(
                  null
                );
              }
            }

          } catch (err) {

            console.error(
              "Auth initialization error:",
              err
            );

          } finally {

            setLoading(false);
          }
        };

      initializeAuth();

    }, []);

    // ================= ADMIN LOGIN =================

    const adminLogin =
      async (
        email,
        password
      ) => {

        try {

          const { data } =
            await axios.post(

              "http://localhost:5000/api/admin/login",

              {
                email,
                password,
              }
            );

          const {
            token,
            id,
          } = data || {};

          if (token) {

            // REMOVE ONLY JOBSEEKER SESSION

            localStorage.removeItem(
              "jobseekerLoggedIn"
            );

            localStorage.removeItem(
              "jobseekerToken"
            );

            localStorage.removeItem(
              "jobseekerUser"
            );

            localStorage.removeItem(
              "jobseekerId"
            );

            setJobseeker(null);

            // SAVE ADMIN SESSION

            const loginTime =
              Date.now().toString();

            localStorage.setItem(
              "adminToken",
              token
            );

            localStorage.setItem(
              "adminLoggedIn",
              "true"
            );

            localStorage.setItem(
              "adminId",
              id
            );

            localStorage.setItem(
              "adminLoginTime",
              loginTime
            );

            setAdminLoggedIn(
              true
            );

            return {

              token,

              success: true,
            };
          }

          return {
            success: false,
          };

        } catch (error) {

          console.error(
            "Admin login failed:",
            error
          );

          return {

            success: false,

            error:
              error.response?.data?.message,
          };
        }
      };

    // ================= ADMIN LOGOUT =================

    const adminLogout =
      () => {

        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminLoggedIn"
        );

        localStorage.removeItem(
          "adminId"
        );

        localStorage.removeItem(
          "adminLoginTime"
        );

        setAdminLoggedIn(
          false
        );
      };

    // ================= JOBSEEKER LOGIN =================

    const jobseekerLogin =
      async (
        token,
        user = null
      ) => {

        try {

          // REMOVE ONLY ADMIN SESSION

          localStorage.removeItem(
            "adminToken"
          );

          localStorage.removeItem(
            "adminLoggedIn"
          );

          localStorage.removeItem(
            "adminId"
          );

          localStorage.removeItem(
            "adminLoginTime"
          );

          setAdminLoggedIn(
            false
          );

          // SAVE JOBSEEKER TOKEN

          localStorage.setItem(
            "jobseekerLoggedIn",
            "true"
          );

          localStorage.setItem(
            "jobseekerToken",
            token
          );

          // USER ALREADY AVAILABLE

          if (user) {

            setJobseeker(user);

            localStorage.setItem(

              "jobseekerUser",

              JSON.stringify(user)
            );

            localStorage.setItem(
              "jobseekerId",
              user.id
            );

          } else {

            // FETCH PROFILE

            const res =
              await axios.get(

                "http://localhost:5000/api/jobseeker/profile",

                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

            const fetchedUser =
              res.data.user;

            setJobseeker(
              fetchedUser
            );

            localStorage.setItem(

              "jobseekerUser",

              JSON.stringify(
                fetchedUser
              )
            );

            localStorage.setItem(
              "jobseekerId",
              fetchedUser.id
            );
          }

        } catch (error) {

          console.error(
            "Jobseeker login failed:",
            error
          );

          setJobseeker(null);
        }
      };

    // ================= JOBSEEKER LOGOUT =================

    const jobseekerLogout =
      () => {

        localStorage.removeItem(
          "jobseekerLoggedIn"
        );

        localStorage.removeItem(
          "jobseekerToken"
        );

        localStorage.removeItem(
          "jobseekerUser"
        );

        localStorage.removeItem(
          "jobseekerId"
        );

        setJobseeker(null);
      };

    // ================= PROVIDER =================

    return (

      <AuthContext.Provider

        value={{

          adminLoggedIn,

          adminLogin,

          adminLogout,

          jobseeker,

          jobseekerLogin,

          jobseekerLogout,

          loading,
        }}
      >

        {children}

      </AuthContext.Provider>
    );
  };

// ================= CUSTOM HOOK =================

export const useAuth =
  () => useContext(
    AuthContext
  );