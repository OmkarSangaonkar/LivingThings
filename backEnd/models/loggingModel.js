const mongoose = require("mongoose");

const loggingSchema = new mongoose.Schema(
  {
    access_time: { type: String, required: true }, // Format: "HH:mm AM/PM"
    access_date: { type: Date, required: true },
    employee_name: { type: String, required: true },
    selected_filter: { type: String, required: true }, // "ON", "OFF", or "BOTH"
  },
  { collection: "logging_data", timestamps: true } // Adding timestamps for automatic createdAt and updatedAt
);

module.exports = mongoose.model("Logging", loggingSchema);
