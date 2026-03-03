const Submission = require("../models/submissionModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel"); 
const Assignment = require("../models/assignmentModel"); 
const Course = require("../models/courseModel"); 

exports.submitWork = async (req, res) => {
  try {
    const { assignment_id, submission_text } = req.body;
    const student_id = req.user.user_id;

    const [submission, created] = await Submission.upsert({
      assignment_id,
      student_id,
      content: submission_text,
    }, { returning: true });

    const assignment = await Assignment.findByPk(assignment_id, {
      include: [{ model: Course }]
    });

    if (assignment && assignment.Course) {
      await Notification.create({
        user_id: assignment.Course.instructor_id,
        message: `Student ${req.user.username} submitted work for "${assignment.title}"`,
        type: 'assignment'
      });
    }

    res.json({ 
      success: true, 
      message: created ? "Work submitted!" : "Submission updated!",
      submission 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.findAll({
      where: { assignment_id: assignmentId },
      include: [{ 
        model: User, 
        as: "student", 
        attributes: ["username", "email"] 
      }]
    });
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findByPk(id, {
      include: [{ model: Assignment }]
    });

    await Submission.update({ grade, feedback }, { where: { submission_id: id } });

    await Notification.create({
      user_id: submission.student_id,
      message: `Your assignment "${submission.Assignment.title}" has been graded. Grade: ${grade}`,
      type: 'grade'
    });

    res.json({ success: true, message: "Grade updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};