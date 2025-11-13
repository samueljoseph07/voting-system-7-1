// backend/index.js (patched)
// Secure & improved version: bcrypt, JWT, helmet, rate-limit, input validation, env usage.

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const FormDataModel = require("./models/FormData");

const app = express();

// Security & parsing middlewares
app.use(helmet());
app.use(express.json());

// CORS: restrict to frontend origin in production
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({ origin: FRONTEND_URL }));

// Rate limiting - adjust limits for your usage
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max requests per IP per windowMs
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(apiLimiter);

// Config & constants
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3001;
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
const FACE_MATCH_THRESHOLD = 0.6; // tune if needed

if (!MONGO_URI || !JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET must be set in environment variables.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB.");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Utility: Euclidean distance
const calculateFaceDistance = (descriptor1, descriptor2) => {
  if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
    return Infinity;
  }
  let sum = 0;
  for (let i = 0; i < descriptor1.length; i++) {
    const d = descriptor1[i] - descriptor2[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
};

// Improved face search: use projection + cursor to avoid loading entire collection at once
const findMatchingFace = async (faceDescriptor) => {
  // Only project fields we need
  const cursor = FormDataModel.find({}, { email: 1, faceData: 1 }).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    const stored = doc.faceData && doc.faceData.descriptor;
    if (stored && Array.isArray(stored) && stored.length === faceDescriptor.length) {
      const distance = calculateFaceDistance(faceDescriptor, stored);
      if (distance < FACE_MATCH_THRESHOLD) {
        // return minimal matching info (do NOT return full descriptor)
        return { id: doc._id, email: doc.email };
      }
    }
  }
  return null;
};

// JWT middleware to protect routes
const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub: userId, email, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ---------- Routes ----------

// Registration
app.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").optional().isString().trim().escape(),
    body("faceData").custom(fd => fd && Array.isArray(fd.descriptor) && fd.descriptor.length > 0)
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid input" });

    const { name, email, password, faceData } = req.body;

    try {
      // Prevent user enumeration: perform checks but return generic message on conflicts
      const existingEmail = await FormDataModel.findOne({ email: email });
      if (existingEmail) {
        return res.status(409).json({ success: false, message: "Registration failed" });
      }

      // Check if face already exists
      const existingFace = await findMatchingFace(faceData.descriptor);
      if (existingFace) {
        return res.status(409).json({ success: false, message: "Registration failed" });
      }

      // Hash password
      const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

      // Create user - store hashed password and descriptor (sensitive)
      const newUser = await FormDataModel.create({
        name,
        email,
        password: hashed,
        faceData: {
          descriptor: faceData.descriptor,
          // optionally store landmarks if provided
          landmarks: faceData.landmarks || []
        }
      });

      // Do NOT return password or face descriptor in response
      return res.status(201).json({
        success: true,
        message: "Registration successful",
        user: { id: newUser._id, email: newUser.email }
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ success: false, message: "An error occurred" });
    }
  }
);

// Login - returns JWT on success
app.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid input" });

    const { email, password } = req.body;

    try {
      // find user including password
      const user = await FormDataModel.findOne({ email: email }).lean();
      if (!user || !user.password) {
        // generic response to avoid enumeration
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      // Issue JWT (subject = user id)
      const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: "6h" });

      // Return token (frontend must include Authorization: Bearer <token> on protected requests)
      return res.json({ success: true, message: "Credentials verified", token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ success: false, message: "An error occurred" });
    }
  }
);

// Face verification - protected route: require the JWT from login
// Frontend must send Authorization: Bearer <token>
// If you need an unauthenticated version, it's possible to support it, but authenticated flow is safer.
app.post(
  "/verify-face",
  requireAuth,
  [
    body("faceData").custom(fd => fd && Array.isArray(fd.descriptor) && fd.descriptor.length > 0)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid input" });

    try {
      // Use email from authenticated token (prevents tampering / enumeration)
      const userEmail = req.user && req.user.email;
      if (!userEmail) return res.status(401).json({ success: false, message: "Authentication required" });

      const { faceData } = req.body;

      const user = await FormDataModel.findOne({ email: userEmail }).lean();
      if (!user || !user.faceData || !user.faceData.descriptor) {
        // generic failure
        return res.status(400).json({ success: false, message: "Face verification failed" });
      }

      const distance = calculateFaceDistance(faceData.descriptor, user.faceData.descriptor);
      if (distance < FACE_MATCH_THRESHOLD) {
        // success
        return res.json({ success: true, message: "Face verification successful" });
      } else {
        return res.status(401).json({ success: false, message: "Face verification failed" });
      }
    } catch (err) {
      console.error("Face verification error:", err);
      return res.status(500).json({ success: false, message: "An error occurred" });
    }
  }
);

// Example protected endpoint (if you later need to mark DB hasVoted or record audits)
app.post("/record-vote", requireAuth, async (req, res) => {
  // This endpoint is an example: implement logic to record txHash / audit after on-chain vote is mined.
  // Ensure you validate inputs and that only authorized callers can write.
  res.json({ success: true, message: "Not implemented in this example" });
});

// Fallback & health
app.get("/", (req, res) => res.json({ success: true, message: "Backend running" }));

// Global error handling can be added here if desired (next, err) => { ... }

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
});
