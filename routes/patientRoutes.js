const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
// 🔑 Import the protect middleware
const { protect } = require("../middlewares/authMiddleware"); 
const {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
  getHistory,
  addHistory,
  updateHistory,
  deleteHistory
} = require("../controllers/patientController");

// ===================================
// 🔒 PATIENT CRUD ROUTES (PROTECTED) 🔒
// ===================================

// POST → Create patient
router.post("/", protect, upload.single("image"), createPatient);

// GET → All patients
router.get("/", protect, getPatients);

// GET → Single patient by ID
router.get("/:id", protect, getPatient);

// PUT → Update patient
router.put("/:id", protect, upload.single("image"), updatePatient);

// DELETE → Delete patient
router.delete("/:id", protect, deletePatient);


// ==========================================
// 🔒 MEDICAL HISTORY ROUTES (PROTECTED) 🔒
// ==========================================

// GET → Medical history for a patient
router.get("/:id/history", protect, getHistory);

// POST → Add history entry
router.post("/:id/history", protect, addHistory);

// PUT → Update history entry
router.put("/:id/history/:historyId", protect, updateHistory);

// DELETE → Delete history entry
router.delete("/:id/history/:historyId", protect, deleteHistory);


module.exports = router;