const Assignment = require("../models/assignmentModel");
const Submission = require("../models/submissionModel");
const createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate, courseId } = req.body;
    const assignment = await Assignment.create({
      title,
      description,
      due_date: dueDate, 
      course_id: courseId,
    });
    res.status(201).json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    await Assignment.update(
      { title, description, due_date: dueDate },
      { where: { assignment_id: req.params.id } }
    );
    res.json({ success: true, message: "Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.user_id; 

    const assignments = await Assignment.findAll({
      where: { course_id: courseId },
      include: [
        {
          model: Submission,
          where: { student_id: userId },
          required: false, 
        },
      ],
      order: [["due_date", "ASC"]],
    });

    res.json({ success: true, assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    await Assignment.destroy({ where: { assignment_id: req.params.id } });
    res.json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

module.exports = { createAssignment, getAssignmentsByCourse, getSingleAssignment, updateAssignment, deleteAssignment };