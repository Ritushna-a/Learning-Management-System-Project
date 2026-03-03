const router = require("express").Router();
const authGuard = require("../helpers/authGuard");
const isInstructor = require("../helpers/isInstructor");
const {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzesByCourse,
  getQuizDetails,
  submitQuiz,
  getMyQuizResult,
  getQuizSubmissions,
} = require("../controllers/quizController");

router.post("/", authGuard, isInstructor, createQuiz);
router.put("/:quizId", authGuard, isInstructor, updateQuiz);
router.delete("/:quizId", authGuard, isInstructor, deleteQuiz);
router.get("/course/:courseId", authGuard, getQuizzesByCourse);
router.get("/:quizId", authGuard, getQuizDetails);
router.post("/:quizId/submit", authGuard, submitQuiz);
router.get("/:quizId/my-result", authGuard, getMyQuizResult);
router.get("/:quizId/submissions", authGuard, getQuizSubmissions);

module.exports = router;
