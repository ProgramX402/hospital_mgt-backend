const express = require("express");
const router = express.Router();
const multer = require("multer");
// 1. 🔑 Import the protect middleware
const { protect } = require("../middleware/authMiddleware"); 
const doctorController = require("../controllers/doctorController");

// Multer memory storage (no saving to disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 2. 🔒 Apply 'protect' to each restricted route

// POST → Create doctor (Requires login to create a doctor)
router.post("/", protect, upload.single("image"), doctorController.createDoctor);

// GET → All doctors (Requires login to view the list)
router.get("/", protect, doctorController.getDoctors);

// GET → Total doctors count (Requires login to view the count)
router.get("/count", protect, doctorController.getDoctorCount); 

// PUT → Update doctor (Requires login to modify a doctor's record)
router.put("/:id", protect, upload.single("image"), doctorController.updateDoctor);

// DELETE → Delete doctor (Requires login to delete a doctor)
router.delete("/:id", protect, doctorController.deleteDoctor);

module.exports = router;