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
router.post("/", upload.single("image"), createPatient);

// GET → All patients
router.get("/", getPatients);

// GET → Single patient by ID
router.get("/:id", getPatient);

// PUT → Update patient
router.put("/:id", upload.single("image"), updatePatient);

// DELETE → Delete patient
router.delete("/:id", deletePatient);


// ==========================================
// 🔒 MEDICAL HISTORY ROUTES (PROTECTED) 🔒
// ==========================================

// GET → Medical history for a patient
router.get("/:id/history", getHistory);

// POST → Add history entry
router.post("/:id/history", addHistory);

// PUT → Update history entry
router.put("/:id/history/:historyId", updateHistory);

// DELETE → Delete history entry
router.delete("/:id/history/:historyId", deleteHistory);


module.exports = router;