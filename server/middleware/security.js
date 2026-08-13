import rateLimit from "express-rate-limit";

// Rate limiter for authentication endpoints (Login, Register, Password Reset)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for standard API endpoints
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 mins
  message: {
    success: false,
    message: "Rate limit exceeded. Please slow down your requests.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
