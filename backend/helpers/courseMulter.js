const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = path.join(__dirname, "../uploads/courses");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `course-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return cb(new Error("Only image files allowed"));
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("thumbnail"); 
