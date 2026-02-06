const express = require("express").Router();
const authGuard = require("../helpers/authGuard");
const isInstructor = require("../helpers/isInstructor");
const upload = require("../helpers/courseMulter");

const {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const handleMulter = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.log("MULTER ERROR:", err.message);
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

express.post("/", authGuard, isInstructor, handleMulter, createCourse);

express.get("/", authGuard, getCourses);

express.put("/:id", authGuard, isInstructor, handleMulter, updateCourse);

express.delete("/:id", authGuard, isInstructor, deleteCourse);

module.exports = express;
