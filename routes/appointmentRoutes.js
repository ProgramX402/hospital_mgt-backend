const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ✅ GET all appointments (with populated doctor/patient names + optional search)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    // Base query
    let query = Appointment.find()
      .populate("doctor", "name email specialty") // populate only relevant doctor fields
      .populate("patient", "name email") // populate only relevant patient fields
      .sort({ createdAt: -1 });

    // Optional search — allows searching by doctor name, patient name, or department
    if (search) {
      // Using RegExp for case-insensitive search
      const regex = new RegExp(search, "i");

      // Fetch all, then filter manually based on populated fields
      const appointments = await Appointment.find()
        .populate("doctor", "name")
        .populate("patient", "name")
        .sort({ createdAt: -1 });

      const filtered = appointments.filter(
        (a) =>
          a.doctor?.name?.match(regex) ||
          a.patient?.name?.match(regex) ||
          a.department?.match(regex)
      );

      return res.json(filtered);
    }

    // Default: return all
    const appointments = await query;
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ POST create a new appointment
router.post("/", async (req, res) => {
  try {
    const { patient, doctor, department, date, time, status, purpose } = req.body;

    // Basic validation
    if (!patient || !doctor || !department || !date || !time || !purpose) {
      return res.status(400).json({ message: "All fields including purpose are required" });
    }

    // Create new appointment
    const newAppt = new Appointment({
      patient,
      doctor,
      department,
      date,
      time,
      status,
      purpose,
    });

    // Save and populate references before returning
    const saved = await newAppt.save();
    const populated = await saved.populate("doctor", "name").populate("patient", "name");

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({ message: "Error creating appointment", error });
  }
});

module.exports = router;
