const User = require("../models/userModel");
const Enrollment = require("../models/enrollmentModel");
const Course = require("../models/courseModel");
const Submission = require("../models/submissionModel");
const Notification = require("../models/notificationModel");
const QuizSubmission = require("../models/quizSubmissionModel");

const getUserProfile = async (req, res) => {
  try {
    res.json({
      username: req.user.username,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      address: req.user.address,
      role: req.user.role,
      profilePicture: req.user.profilePicture,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = req.user;

    const { username, phoneNumber, address } = req.body;

    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (req.file) user.profilePicture = `/uploads/profile/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllStudents = async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await User.findAll({
      where: { role: "student" },
      attributes: ["user_id", "username", "email", "role", "phoneNumber", "createdAt"],
      include: [
        {
          model: Enrollment,
          attributes: ["enrollment_id", "course_id"],
          include: [
            {
              model: Course,
              attributes: ["course_id", "title"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== "instructor" && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { id } = req.params;
    const student = await User.findByPk(id);

    if (!student || student.role !== "student") {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await QuizSubmission.destroy({ where: { student_id: student.user_id } });
    await Submission.destroy({ where: { student_id: student.user_id } });
    await Enrollment.destroy({ where: { student_id: student.user_id } });
    await Notification.destroy({ where: { user_id: student.user_id } });
    await student.destroy();

    return res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to delete student" });
  }
};

module.exports = { getUserProfile, updateUserProfile, getAllStudents, deleteStudent };