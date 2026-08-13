import jwt from "jsonwebtoken";

// ======================================================
// Verify Admin / General User Token
// ======================================================

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// ======================================================
// Verify Jobseeker Token
// ======================================================

export const verifyJobseekerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Jobseeker JWT Error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

// Default export
export default verifyToken;