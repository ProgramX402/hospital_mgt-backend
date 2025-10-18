const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctor: { type: String, required: true },
    patient: { type: String, required: true },
    department: { type: String, required: true },
    date: { type: String, required: true }, // e.g. "2025-10-18"
    time: { type: String, required: true }, // e.g. "14:30"
    purpose: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
