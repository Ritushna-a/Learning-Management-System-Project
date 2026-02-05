const multer = require("multer");
const path = require("path");
const fs = require("fs");

const dir = "./uploads/profile";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
}).single("profilePicture"); 
module.exports = uploadProfileImage;
