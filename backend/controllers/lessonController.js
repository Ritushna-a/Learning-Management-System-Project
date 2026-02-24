const Lesson = require("../models/lessonModel");

const createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    if (!title || !content || !courseId) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const lesson = await Lesson.create({
      title,
      content,
      course_id: courseId,
    });

    res.status(201).json({ success: true, lesson });
  } catch (error) {
    console.error("CREATE LESSON ERROR:", error);
    res.status(500).json({ success: false, message: "Lesson creation failed" });
  }
};

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.findAll({ where: { course_id: courseId } });
    res.json({ success: true, lessons });
  } catch (error) {
    console.error("GET LESSONS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch lessons" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });

    await lesson.update({ title, content });
    res.json({ success: true, lesson });
  } catch (error) {
    console.error("UPDATE LESSON ERROR:", error);
    res.status(500).json({ success: false, message: "Lesson update failed" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });

    await lesson.destroy();
    res.json({ success: true, message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("DELETE LESSON ERROR:", error);
    res.status(500).json({ success: false, message: "Lesson deletion failed" });
  }
};

module.exports = {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson,
};