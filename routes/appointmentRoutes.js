const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getTodayAppointments,
} = require("../controllers/appointmentController");

// POST → Create appointment
router.post("/", createAppointment);

// GET → All appointments
router.get("/", getAppointments);

// GET → Single appointment by ID
router.get("/:id", getAppointmentById);

// GET → Today's appointments
router.get("/today/all", getTodayAppointments);

module.exports = router;
