const express = require("express");
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // ⬅️ Import Middleware

// ----------------------------------------------------------------------
// Example Controller Functions (you would need to create these)
// ----------------------------------------------------------------------
const getDashboardData = (req, res) => {
    // Access the authenticated user via req.user
    res.json({ message: `Welcome, ${req.user.fullname}!`, data: {} });
};
const getAppointments = (req, res) => {
    res.json({ message: 'Protected Appointments List', userId: req.user._id });
};

// ----------------------------------------------------------------------
// Apply the 'protect' middleware to all application routes
// ----------------------------------------------------------------------

// 🔒 All routes below require a valid JWT token 🔒
router.use(protect);

router.get("/dashboard", getDashboardData);
router.get("/appointments", getAppointments);
router.get("/doctors", (req, res) => res.json({ message: "Protected Doctors" }));
router.get("/patients", (req, res) => res.json({ message: "Protected Patients" }));
router.get("/settings", (req, res) => res.json({ message: "Protected Settings" }));

module.exports = router;