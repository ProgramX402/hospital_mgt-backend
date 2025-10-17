const Patient = require("../models/Patient");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// 🧠 Create Patient
exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, condition, address, doctor } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "patients" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      phone,
      email,
      condition,
      address,
      doctor,
      image: imageUrl,
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({ error: "Server error while creating patient" });
  }
};

// 📋 Get all patients
exports.getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const patients = await Patient.find(query).sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Server error while fetching patients" });
  }
};

// 🔍 Get a single patient
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching patient" });
  }
};

// ✏️ Update Patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "patients" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      updateData.image = uploadResult.secure_url;
    }

    const updated = await Patient.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Patient not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Server error while updating patient" });
  }
};

// 🗑️ Delete Patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ error: "Server error while deleting patient" });
  }
};

//
// 🩺 ====== MEDICAL HISTORY SECTION ======
//

// ➕ Add a history record to a patient
exports.addHistory = async (req, res) => {
  try {
    const { id } = req.params; // patient ID
    const { date, diagnosis, treatment, prescription, doctor } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const newHistory = { date, diagnosis, treatment, prescription, doctor };
    patient.history.push(newHistory);
    await patient.save();

    res.status(201).json({ message: "History added successfully", patient });
  } catch (error) {
    console.error("Error adding history:", error);
    res.status(500).json({ error: "Server error while adding history" });
  }
};

// 🔁 Update a specific history entry
exports.updateHistory = async (req, res) => {
  try {
    const { id, historyId } = req.params;
    const { date, diagnosis, treatment, prescription, doctor } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const historyItem = patient.history.id(historyId);
    if (!historyItem) return res.status(404).json({ message: "History entry not found" });

    historyItem.date = date || historyItem.date;
    historyItem.diagnosis = diagnosis || historyItem.diagnosis;
    historyItem.treatment = treatment || historyItem.treatment;
    historyItem.prescription = prescription || historyItem.prescription;
    historyItem.doctor = doctor || historyItem.doctor;

    await patient.save();
    res.json({ message: "History updated successfully", patient });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ error: "Server error while updating history" });
  }
};

// ❌ Delete a specific history entry
exports.deleteHistory = async (req, res) => {
  try {
    const { id, historyId } = req.params;

    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const historyItem = patient.history.id(historyId);
    if (!historyItem) return res.status(404).json({ message: "History entry not found" });

    historyItem.deleteOne();
    await patient.save();

    res.json({ message: "History deleted successfully", patient });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ error: "Server error while deleting history" });
  }
};

// 📖 Get all history for a patient
exports.getHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json(patient.history);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching history" });
  }
};
