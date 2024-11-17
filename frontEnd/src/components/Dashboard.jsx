import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import LoggingForm from "./LoggingForm"; // Import the LoggingForm component

// Register all necessary chart elements
Chart.register(...registerables);

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("BOTH"); // Default to 'BOTH'

  // Fetch chart data from the backend API
  const fetchChartData = async (filter) => {
    try {
      const response = await axios.get("http://localhost:5000/api/chart", {
        params: { filter }, // Send the filter as a query parameter
      });
      const rawData = response.data;

      // Filter out entries where total_kwh is zero
      const filteredData = rawData.filter((item) => item.total_kwh > 0);

      // Process data for the chart
      const dates = filteredData.map((item) => new Date(item.createdAt).toLocaleDateString());

      let energyConsumptionOn = [];
      let energyConsumptionOff = [];

      // Check the filter and process accordingly
      if (filter === "BOTH") {
        // Combine ON and OFF data into one dataset for "BOTH" filter
        filteredData.forEach((item) => {
          if (item.algo_status === 1) {
            energyConsumptionOn.push(item.total_kwh); // ON data
            energyConsumptionOff.push(0); // Add 0 for OFF
          } else {
            energyConsumptionOff.push(item.total_kwh); // OFF data
            energyConsumptionOn.push(0); // Add 0 for ON
          }
        });
      } else {
        // If the filter is ON or OFF, just add the corresponding data
        energyConsumptionOn = filteredData
          .filter((item) => item.algo_status === 1) // Filter ON (algo_status = 1)
          .map((item) => item.total_kwh);
        energyConsumptionOff = filteredData
          .filter((item) => item.algo_status === 0) // Filter OFF (algo_status = 0)
          .map((item) => item.total_kwh);
      }

      // Set chart data state with combined ON and OFF data (or separated based on filter)
      setChartData({
        labels: dates,
        datasets: [
          {
            label: "Energy Consumption ON (kWh)",
            data: energyConsumptionOn,
            borderColor: "rgba(75, 192, 192, 1)", // Light green for ON
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Light green for ON
            borderWidth: 1,
            barThickness: 12,
            categoryPercentage: 0.8,
            barPercentage: 0.7,
            tension: 0.4,
          },
          {
            label: "Energy Consumption OFF (kWh)",
            data: energyConsumptionOff,
            borderColor: "rgba(255, 99, 132, 1)", // Red for OFF
            backgroundColor: "rgba(255, 99, 132, 0.6)", // Red for OFF
            borderWidth: 1,
            barThickness: 12,
            categoryPercentage: 0.8,
            barPercentage: 0.7,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchChartData(selectedFilter); // Fetch data whenever the filter changes
  }, [selectedFilter]);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter); // Update filter state
  };

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Dashboard
      </h1>
      {/* Include LoggingForm component */}
      <LoggingForm
        fetchChartData={fetchChartData}
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange} // Pass the filter handler to LoggingForm
      />

      {/* Display chart if data is available */}
      {chartData ? (
        <div className="mt-6 w-full max-w-4xl mx-auto">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  ticks: {
                    maxRotation: 90, // Rotate X-axis labels to avoid overlapping
                    minRotation: 45, // Rotate X-axis labels for better readability
                  },
                  grid: {
                    display: false, // Disable grid lines to make the chart clearer
                  },
                },
                y: {
                  beginAtZero: true, // Ensure the Y-axis starts from zero
                },
              },
              plugins: {
                legend: {
                  position: "top", // Display legend on top
                },
              },
            }}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">Loading...</p> // Loading message
      )}
    </div>
  );
};

export default Dashboard;
