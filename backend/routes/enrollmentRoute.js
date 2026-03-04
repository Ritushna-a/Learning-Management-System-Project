const router = require("express").Router();
const authGuard = require("../helpers/authGuard");
const {
  enrollInCourse,
  unenrollFromCourse,
  getMyEnrollments,
  getCourseStudents,
} = require("../controllers/enrollmentController");

router.post("/:courseId", authGuard, enrollInCourse);
router.delete("/:courseId", authGuard, unenrollFromCourse);
router.get("/my-courses", authGuard, getMyEnrollments);
router.get("/course/:courseId/students", authGuard, getCourseStudents);

module.exports = router;
