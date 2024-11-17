const express = require("express");
const router = express.Router();
const Logging = require("../models/loggingModel"); // Import Logging model

// POST request to log user activity
router.post("/", async (req, res) => {
  console.log("POST request received at /api/logging"); // This should show up in the console
  try {
    // Destructure the data sent by the frontend
    const { access_time, access_date, employee_name, selected_filter } =
      req.body;

    // Create a new log entry
    const logEntry = new Logging({
      access_time,
      access_date,
      employee_name,
      selected_filter,
    });

    // Save the log entry to the database
    await logEntry.save();

    res.status(201).json({ message: "Log entry saved successfully!" });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all chart data
// router.get("/", async (req, res) => {
//   res.send("logging works fine ok");
//   console.log("logging request acccepted");
// });
module.exports = router; // Export the router correctly
