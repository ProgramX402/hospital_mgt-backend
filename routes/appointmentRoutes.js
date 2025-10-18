const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// ✅ GET all appointments (with populated doctor/patient names + optional search)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    // Populate doctor and patient fields from their collections
    let query = Appointment.find()
      .populate("doctor", "name") // only return doctor.name
      .populate("patient", "name") // only return patient.name
      .sort({ createdAt: -1 });

    // Optional search (by doctor or patient name)
    if (search) {
      query = Appointment.find()
        .populate({
          path: "doctor",
          select: "name",
          match: { name: { $regex: search, $options: "i" } },
        })
        .populate({
          path: "patient",
          select: "name",
          match: { name: { $regex: search, $options: "i" } },
        })
        .sort({ createdAt: -1 });
    }

    const appointments = await query;

    // Filter out any null matches when searching
    const filteredAppointments = search
      ? appointments.filter((a) => a.doctor || a.patient)
      : appointments;

    res.json(filteredAppointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ POST create new appointment
router.post("/", async (req, res) => {
  try {
    const { patient, doctor, department, date, time, status, purpose } = req.body;

    // Basic validation
    if (!patient || !doctor || !department || !date || !time || !purpose) {
      return res.status(400).json({ message: "All fields including purpose are required" });
    }

    const newAppt = new Appointment({
      patient,
      doctor,
      department,
      date,
      time,
      status,
      purpose,
    });

    const saved = await newAppt.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({ message: "Error creating appointment", error });
  }
});

module.exports = router;
