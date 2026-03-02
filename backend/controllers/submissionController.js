const Submission = require("../models/submissionModel");
const User = require("../models/userModel");

exports.submitWork = async (req, res) => {
  try {
    const { assignment_id, submission_text } = req.body;
    const student_id = req.user.user_id; 

    if (!assignment_id || !submission_text) {
      return res.status(400).json({ success: false, message: "Missing content" });
    }

    const [submission, created] = await Submission.upsert({
      assignment_id,
      student_id,
      content: submission_text,
    }, { returning: true });

    res.json({ 
      success: true, 
      message: created ? "Work submitted!" : "Submission updated!",
      submission 
    });
  } catch (error) {
    console.error("SUBMISSION ERROR:", error);
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
    await Submission.update({ grade, feedback }, { where: { submission_id: id } });
    res.json({ success: true, message: "Grade updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};