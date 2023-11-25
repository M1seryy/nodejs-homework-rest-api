const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const uploadDir = path.join(__dirname, "..", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extraName = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extraName);
    cb(null, `${baseName}-${Math.random()}${extraName}`);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
