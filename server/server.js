import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import axios from "axios";
import rateLimit from "express-rate-limit";
import { body, validationResult, param } from "express-validator"
import compression from "compression";
import validateEnvironment from "./middleware/validateEnv.js";


let env;
try {
  env = validateEnvironment(); // Validate environment variables
} catch (error) {
  console.error("Failed to start server:", error.message);
  process.exit(1); // Exit the process if validation fails
}



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://greigmcmahon.com'], // Specify allowed domains
    methods: ['GET', 'POST'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
    credentials: true, // Allow sending cookies if needed
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1 KB
  })
);


// Define rate-limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window (15 minutes)
  max: 100, // Maximum requests per IP within the window
  message: {
    status: 429,
    error: "Too many requests, please try again later."
  },
  standardHeaders: true, // Include rate limit info in response headers
  legacyHeaders: false, // Disable the old "X-RateLimit" headers
});

// Define login rate-limiting rules
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow only 5 requests per IP
  message: {
    status: 429,
    error: "Too many login attempts. Please try again later.",
  },
});


// Apply the rate limiter to all routes
app.use(limiter);

// New /api/users endpoint
app.get("/api/users", async (req, res) => {
  try {
    // Fetch data from external API
    process.env.VITE_API_USERS
    const response = await axios.get(process.env.VITE_API_USERS);
    const users = response.data.data; // Extract the user data

    // Respond with the fetched user data
    res.json({
      data: users
    });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({
      message: "Error fetching user data"
    });
  }
});

app.post(
  "/api/login",
  [
    body("username").isString().withMessage("Username must be a valid string"),
    body("password").isString().withMessage("Password must be a valid string"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const response = await axios.post(process.env.VITE_API_LOGIN, { username, password });
      res.status(200).json({
        accessToken: response.data.token || response.data.accessToken,
      });
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      res.status(401).json({ message: "Invalid credentials" });
    }
  }
);


app.get(
  "/api/dummy-user",
  [
    // Validate Authorization header
    param("authorization")
      .optional()
      .matches(/^Bearer\s[\w-]+\.[\w-]+\.[\w-]+$/)
      .withMessage("Invalid Bearer token format"),
  ],
  async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token
    console.log("Received token in /api/dummy-user:", token);

    if (!token) {
      console.error("Missing token in request headers");
      return res.status(401).json({ message: "Unauthorized. Missing token." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Token validation failed:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Forward request with the token
      const response = await axios.get(process.env.VITE_API_BEARER_TOKEN, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching data from external API:", error.message);
      res.status(500).json({ message: "Error fetching data from external API." });
    }
  }
);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: "Validation failed", details: err.details });
  }

  res.status(err.status || 500).json({
    error: err.message || "An unexpected error occurred.",
  });
});

app.get("/health", async (req, res) => {
  try {
    // Check connectivity to an external API
    const apiCheck = await axios.get(process.env.VITE_API_USERS);

    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      externalApi: {
        status: "reachable",
        code: apiCheck.status,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: "Failed to connect to external API",
      details: error.message,
    });
  }
});



// Start the server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}



export default app;