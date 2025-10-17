const Doctor = require("../models/Doctor");
const cloudinary = require("../config/cloudinary"); // ✅ Import configured cloudinary
const streamifier = require("streamifier");

// 🩺 Create Doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialty, department, phone, email } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "doctors" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      imageUrl = uploadResult.secure_url;
    }

    const doctor = await Doctor.create({
      name,
      specialty,
      department,
      phone,
      email,
      image: imageUrl,
    });

    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 📋 Get All Doctors (with optional search)
exports.getDoctors = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { department: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const doctors = await Doctor.find(query).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update Doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, department, phone, email } = req.body;
    let updateData = { name, specialty, department, phone, email };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "doctors" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
      updateData.image = uploadResult.secure_url;
    }

    const updated = await Doctor.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Doctor not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
