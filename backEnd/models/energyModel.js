const mongoose = require("mongoose");

const energySchema = new mongoose.Schema(
  {
    total_kwh: Number,
    createdAt: Date,
    algo_status: Number, // Use algo_status for ON/OFF (1 for ON, 0 for OFF)
    serialNo: String,
    clientID: mongoose.Schema.Types.ObjectId,
    deviceMapID: mongoose.Schema.Types.ObjectId,
    devices: [mongoose.Schema.Types.ObjectId],
    billing_ammount: Number,
    ac_run_hrs: Number,
    ac_fan_hrs: Number,
    updatedAt: Date,
    energy_savings: Object,
    mitigated_co2: Number,
    weather: Object,
  },
  { collection: "energy_data" }
);

module.exports = mongoose.model("Energy", energySchema);
