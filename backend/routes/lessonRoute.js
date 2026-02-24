const express = require("express").Router();
const authGuard = require("../helpers/authGuard");
const isInstructor = require("../helpers/isInstructor");

const { createLesson, getLessonsByCourse, updateLesson, deleteLesson, } = require("../controllers/lessonController");

express.post("/", authGuard, isInstructor, createLesson);
express.get("/:courseId", authGuard, getLessonsByCourse);
express.put("/:id", authGuard, isInstructor, updateLesson);
express.delete("/:id", authGuard, isInstructor, deleteLesson);

module.exports = express;