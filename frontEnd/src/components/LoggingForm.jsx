/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";

const LoggingForm = ({
  fetchChartData,
  selectedFilter,
  handleFilterChange,
}) => {
  const [accessTime, setAccessTime] = useState("");
  const [accessDate, setAccessDate] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [filter, setFilter] = useState(selectedFilter); // Set initial filter from props
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

    // Prepare the log data
    const logData = {
      access_time: accessTime,
      access_date: accessDate,
      employee_name: employeeName,
      selected_filter: filter,
    };

    try {
      // Send POST request to the backend to log the activity
      const response = await axios.post(
        "http://localhost:5000/api/logging",
        logData
      );
      setMessage(response.data.message);
      setError("");

      // Call function to refresh chart data
      if (fetchChartData) {
        fetchChartData(filter); // Send selected filter to fetchChartData
      }

      // Clear form fields after successful submission
      setAccessTime("");
      setAccessDate("");
      setEmployeeName("");
      setFilter("BOTH"); // Reset filter to BOTH after submission
    } catch (err) {
      setError("Failed to log the activity. Please try again.");
      setMessage("");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Log User Activity
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="accessTime"
            className="text-sm font-medium text-gray-600"
          >
            Access Time (HH:mm AM/PM):
          </label>
          <input
            type="text"
            id="accessTime"
            value={accessTime}
            onChange={(e) => setAccessTime(e.target.value)}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="accessDate"
            className="text-sm font-medium text-gray-600"
          >
            Access Date:
          </label>
          <input
            type="date"
            id="accessDate"
            value={accessDate}
            onChange={(e) => setAccessDate(e.target.value)}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="employeeName"
            className="text-sm font-medium text-gray-600"
          >
            Employee Name:
          </label>
          <input
            type="text"
            id="employeeName"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="selectedFilter"
            className="text-sm font-medium text-gray-600"
          >
            Selected Filter:
          </label>
          <select
            id="selectedFilter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              handleFilterChange(e.target.value); // Update filter in parent component
            }}
            required
            className="mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="BOTH">Both</option>
            <option value="ON">ON</option>
            <option value="OFF">OFF</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 p-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none disabled:bg-gray-400"
        >
          {loading ? "Logging..." : "Log Activity"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
};

export default LoggingForm;
