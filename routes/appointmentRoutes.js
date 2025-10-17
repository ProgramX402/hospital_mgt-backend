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
    const newAppt = new Appointment(req.body);
    const saved = await newAppt.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error creating appointment", error });
  }
});

module.exports = router;
