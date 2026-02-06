const Course = require("../models/courseModel");
const path = require("path");
const fs = require("fs");

const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    let thumbnailPath = null;
    if (req.file) {
      thumbnailPath = `/uploads/courses/${req.file.filename}`;
    }

    const course = await Course.create({
      title,
      description,
      thumbnail: thumbnailPath,
      instructor_id: req.user.user_id,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    res.status(500).json({ success: false, message: "Course creation failed" });
  }
};

const getCourses = async (req, res) => {
  try {
    const where = req.user.role === "instructor" ? { instructor_id: req.user.user_id } : {};

    const courses = await Course.findAll({ where });
    res.json({ success: true, courses });
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { title, description } = req.body;
    let thumbnailPath = course.thumbnail;

    if (req.file) {

      if (course.thumbnail) {
        const oldPath = path.join(__dirname, "..", course.thumbnail);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      thumbnailPath = `/uploads/courses/${req.file.filename}`;
    }

    await course.update({ title, description, thumbnail: thumbnailPath });
    res.json({ success: true, course });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({ success: false, message: "Course update failed" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    if (course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (course.thumbnail) {
      const filePath = path.join(__dirname, "..", course.thumbnail);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await course.destroy();
    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    res.status(500).json({ success: false, message: "Course deletion failed" });
  }
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};
