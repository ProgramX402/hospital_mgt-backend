const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// GET all appointments (with optional search)
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    // Build query object
    const query = search
      ? {
          $or: [
            { patient: { $regex: search, $options: "i" } }, // case-insensitive
            { doctor: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// POST create appointment
router.post("/", async (req, res) => {
  try {
    const { patient, doctor, department, date, time, status, purpose } = req.body;

    // Basic validation
    if (!patient || !doctor || !department || !date || !time || !purpose) {
      return res.status(400).json({ message: "All fields including purpose are required" });
    }

    const newAppt = new Appointment({ patient, doctor, department, date, time, status, purpose });
    const saved = await newAppt.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error creating appointment", error });
  }
});

module.exports = router;
