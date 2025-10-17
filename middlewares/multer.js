const multer = require("multer");

// Store file in memory (so we can send it to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB
  },
});

module.exports = upload;
