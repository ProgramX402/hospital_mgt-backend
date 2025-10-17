const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
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

// CRUD Routes
router.post("/", upload.single("image"), createPatient);
router.get("/", getPatients);
router.get("/:id", getPatient);
router.put("/:id", upload.single("image"), updatePatient);
router.delete("/:id", deletePatient);
// ===== MEDICAL HISTORY ROUTES =====
router.get("/:id/history", getHistory);
router.post("/:id/history", addHistory);
router.put("/:id/history/:historyId", updateHistory);
router.delete("/:id/history/:historyId", deleteHistory);


module.exports = router;
