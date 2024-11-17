const express = require("express");
const router = express.Router();
const Energy = require("../models/energyModel"); // Ensure you're importing the correct model

// Get chart data with optional filter query (ON, OFF, BOTH)
router.get("/", async (req, res) => {
  const filter = req.query.filter || "BOTH"; // Default to 'BOTH' if no filter is provided

  try {
    let query = {};

    // Apply filtering based on the selected filter (ON, OFF, BOTH)
    if (filter === "ON") {
      query.algo_status = 1; // Filter for ON (algo_status = 1)
    } else if (filter === "OFF") {
      query.algo_status = 0; // Filter for OFF (algo_status = 0)
    }

    // Fetch the data from the database based on the filter
    const rawData = await Energy.find(query); // Make sure you have the correct collection

    // If no data is found, send an empty array
    if (rawData.length === 0) {
      return res.status(200).json([]);
    }

    // Return the filtered data to the frontend
    res.json(rawData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).send("Error fetching chart data");
  }
});

module.exports = router;
