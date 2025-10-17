const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    condition: { type: String, required: true },
    address: { type: String },
    doctor: { type: String },
    diseases: { type: [String], default: [] },
    history: [
      {
        date: { type: String },
        diagnosis: { type: String },
        treatment: { type: String },
        prescription: { type: String },
        doctor: { type: String },
      },
    ],
    image: { type: String }, // Cloudinary image URL
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);
