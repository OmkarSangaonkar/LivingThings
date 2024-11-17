const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 5000; // Default to port 5000 if no PORT is defined in .env

app.use(cors()); // Enable CORS for the app
app.use(express.json()); // Parse incoming JSON data

// Import your routes
const chartRouter = require("./routes/energyRoute");
const loggingRouter = require("./routes/loggingRoute"); // Import the logging route

// Register routes
app.use("/api/logging", loggingRouter); // Register logging route
app.use("/api/chart", chartRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.URI, { ssl: true })
  .then(() => {
    console.log("Connected to DB successfully...");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
