const express = require("express");
const router = express.Router();
// 1. 🔑 Import the protect middleware
const { protect } = require("../middlewares/authMiddleware"); 
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  getTodayAppointments,
} = require("../controllers/appointmentController");

// 2. 🔒 Apply the protect middleware to ALL routes in this file
// All route definitions below this line will require a valid JWT in the header
router.use(protect); 

// POST → Create appointment
router.post("/", createAppointment);

// GET → All appointments
router.get("/", getAppointments);

// GET → Single appointment by ID
router.get("/:id", getAppointmentById);

// GET → Today's appointments
router.get("/today/all", getTodayAppointments);

module.exports = router;