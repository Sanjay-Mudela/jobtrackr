const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes are protected
router.use(authMiddleware);

// Stats (must come before /:id routes or after, both ok)
router.get("/stats", getJobStats);

// Create job
router.post("/", createJob);

// Get all jobs
router.get("/", getJobs);

// Get single job
router.get("/:id", getJobById);

// Update job
router.put("/:id", updateJob);

// Delete job
router.delete("/:id", deleteJob);

module.exports = router;
