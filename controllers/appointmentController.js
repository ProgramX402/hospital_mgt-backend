const Appointment = require("../models/Appointment");

// ✅ Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, patient, department, date, time, purpose } = req.body;

    if (!doctor || !patient || !department || !date || !time || !purpose) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const appointment = new Appointment({
      doctor,
      patient,
      department,
      date,
      time,
      purpose,
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error creating appointment" });
  }
};

// ✅ Fetch all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error fetching appointments" });
  }
};

// ✅ Fetch single appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ message: "Server error fetching appointment" });
  }
};

// ✅ Fetch today's appointments
exports.getTodayAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-10-18"
    const todaysAppointments = await Appointment.find({ date: today });
    res.json(todaysAppointments);
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ message: "Server error fetching today's appointments" });
  }
};
