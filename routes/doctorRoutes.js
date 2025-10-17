const express = require("express");
const router = express.Router();
const multer = require("multer");
const doctorController = require("../controllers/doctorController");

// Multer memory storage (no saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CRUD Routes
router.post("/", upload.single("image"), doctorController.createDoctor);
router.get("/", doctorController.getDoctors);
router.get("/count", doctorController.getDoctorCount); // ✅ New route for total doctors
router.put("/:id", upload.single("image"), doctorController.updateDoctor);
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;
