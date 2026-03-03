const Quiz = require("../models/quizModel");
const QuizSubmission = require("../models/quizSubmissionModel");
const Course = require("../models/courseModel");
const Enrollment = require("../models/enrollmentModel");
const User = require("../models/userModel");

const normalize = (value) => String(value || "").trim().toLowerCase();

const createQuiz = async (req, res) => {
  try {
    const { courseId, title, description, questions } = req.body;

    if (!courseId || !title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "courseId, title and questions are required" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const quiz = await Quiz.create({
      course_id: courseId,
      title,
      description,
      questions,
    });

    return res.status(201).json({ success: true, message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("CREATE QUIZ ERROR:", error);
    return res.status(500).json({ success: false, message: "Quiz creation failed" });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, description, questions } = req.body;

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const course = await Course.findByPk(quiz.course_id);
    if (!course || course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "title and questions are required" });
    }

    await quiz.update({
      title,
      description,
      questions,
    });

    return res.json({ success: true, message: "Quiz updated successfully", quiz });
  } catch (error) {
    console.error("UPDATE QUIZ ERROR:", error);
    return res.status(500).json({ success: false, message: "Quiz update failed" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const course = await Course.findByPk(quiz.course_id);
    if (!course || course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await QuizSubmission.destroy({ where: { quiz_id: quizId } });
    await quiz.destroy();

    return res.json({ success: true, message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("DELETE QUIZ ERROR:", error);
    return res.status(500).json({ success: false, message: "Quiz deletion failed" });
  }
};

const getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (req.user.role === "instructor" && course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (req.user.role === "student") {
      const enrollment = await Enrollment.findOne({
        where: {
          course_id: courseId,
          student_id: req.user.user_id,
        },
      });

      if (!enrollment) {
        return res.status(403).json({ success: false, message: "Enroll in this course to access quizzes" });
      }
    }

    const quizzes = await Quiz.findAll({
      where: { course_id: courseId },
      attributes: ["quiz_id", "course_id", "title", "description", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, quizzes });
  } catch (error) {
    console.error("GET QUIZZES ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch quizzes" });
  }
};

const getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    if (req.user.role === "student") {
      const enrollment = await Enrollment.findOne({
        where: {
          course_id: quiz.course_id,
          student_id: req.user.user_id,
        },
      });

      if (!enrollment) {
        return res.status(403).json({ success: false, message: "Enroll in this course to access quiz" });
      }
    }
    if (req.user.role === "instructor") {
      const course = await Course.findByPk(quiz.course_id);
      if (!course || course.instructor_id !== req.user.user_id) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }
    }

    const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
    const safeQuestions =
      req.user.role === "student"
        ? questions.map((q) => ({
            question: q.question,
            options: Array.isArray(q.options) ? q.options : [],
          }))
        : questions;

    return res.json({
      success: true,
      quiz: {
        quiz_id: quiz.quiz_id,
        course_id: quiz.course_id,
        title: quiz.title,
        description: quiz.description,
        questions: safeQuestions,
      },
    });
  } catch (error) {
    console.error("GET QUIZ DETAILS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch quiz details" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can submit quizzes" });
    }

    const { quizId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "answers array is required" });
    }

    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const enrollment = await Enrollment.findOne({
      where: {
        course_id: quiz.course_id,
        student_id: req.user.user_id,
      },
    });

    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Enroll in this course before submitting quiz" });
    }

    const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
    let score = 0;
    const feedback = questions.map((question, index) => {
      const submittedRaw = answers[index];
      const submitted = normalize(submittedRaw);
      const correctRaw = question.correctAnswer;
      const correct = normalize(correctRaw);
      const isCorrect = Boolean(submitted && submitted === correct);

      if (isCorrect) score += 1;

      return {
        question: question.question,
        selectedAnswer: submittedRaw || "",
        correctAnswer: correctRaw || "",
        status: isCorrect ? "correct" : "incorrect",
      };
    });

    const total = questions.length;

    const [submission] = await QuizSubmission.upsert(
      {
        quiz_id: quiz.quiz_id,
        student_id: req.user.user_id,
        answers,
        score,
        total,
      },
      { returning: true }
    );

    return res.json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        score,
        total,
        feedback,
      },
      submission,
    });
  } catch (error) {
    console.error("SUBMIT QUIZ ERROR:", error);
    return res.status(500).json({ success: false, message: "Quiz submission failed" });
  }
};

const getMyQuizResult = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Students only" });
    }

    const { quizId } = req.params;

    const submission = await QuizSubmission.findOne({
      where: {
        quiz_id: quizId,
        student_id: req.user.user_id,
      },
      attributes: ["quiz_submission_id", "quiz_id", "score", "total", "answers", "updatedAt"],
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    return res.json({ success: true, submission });
  } catch (error) {
    console.error("GET MY QUIZ RESULT ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch result" });
  }
};

const getQuizSubmissions = async (req, res) => {
  try {
    if (req.user.role !== "instructor") {
      return res.status(403).json({ success: false, message: "Instructors only" });
    }

    const { quizId } = req.params;
    const quiz = await Quiz.findByPk(quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    const course = await Course.findByPk(quiz.course_id);
    if (!course || course.instructor_id !== req.user.user_id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const submissions = await QuizSubmission.findAll({
      where: { quiz_id: quizId },
      include: [{
        model: User,
        as: "student",
        attributes: ["user_id", "username", "email"],
      }],
      order: [["updatedAt", "DESC"]],
    });

    return res.json({ success: true, submissions });
  } catch (error) {
    console.error("GET QUIZ SUBMISSIONS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch quiz submissions" });
  }
};

module.exports = {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzesByCourse,
  getQuizDetails,
  submitQuiz,
  getMyQuizResult,
  getQuizSubmissions,
};
