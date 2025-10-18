const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // 🔗 Use ObjectId references so we can populate doctor/patient details
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    department: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
    },
    purpose: { type: String, required: true }, // ✅ Purpose of the surgery
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
