const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const User = require("../models/userModel");

const enrollInCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can enroll" });
    }

    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const [enrollment, created] = await Enrollment.findOrCreate({
      where: {
        course_id: courseId,
        student_id: req.user.user_id,
      },
      defaults: {
        course_id: courseId,
        student_id: req.user.user_id,
      },
    });

    if (!created) {
      return res.status(409).json({ success: false, message: "Already enrolled" });
    }

    return res.status(201).json({ success: true, message: "Enrolled successfully", enrollment });
  } catch (error) {
    console.error("ENROLL ERROR:", error);
    return res.status(500).json({ success: false, message: "Enrollment failed" });
  }
};

const unenrollFromCourse = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can unenroll" });
    }

    const { courseId } = req.params;
    const deleted = await Enrollment.destroy({
      where: {
        course_id: courseId,
        student_id: req.user.user_id,
      },
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    return res.json({ success: true, message: "Unenrolled successfully" });
  } catch (error) {
    console.error("UNENROLL ERROR:", error);
    return res.status(500).json({ success: false, message: "Unenrollment failed" });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can view enrollments" });
    }

    const enrollments = await Enrollment.findAll({
      where: { student_id: req.user.user_id },
      include: [{ model: Course }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, enrollments });
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch enrollments" });
  }
};

const getCourseStudents = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Instructors only" });
    }

    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const enrollments = await Enrollment.findAll({
      where: { course_id: courseId },
      include: [{
        model: User,
        as: "student",
        attributes: ["user_id", "username", "email", "phoneNumber"],
      }],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, students: enrollments.map((e) => e.student) });
  } catch (error) {
    console.error("GET COURSE STUDENTS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch course students" });
  }
};

module.exports = {
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrollments,
  getCourseStudents,
};
