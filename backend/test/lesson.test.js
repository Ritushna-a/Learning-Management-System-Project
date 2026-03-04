const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/Database");

describe("Lesson API", () => {
  let instructorToken;
  let studentToken;
  let courseId;
  let lessonId;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();

    const instructorEmail = `lesson_instructor${uniqueId}@gmail.com`;
    await request(app)
      .post("/api/user/register")
      .send({
        username: `lesson_instructor${uniqueId}`,
        email: instructorEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: `9${uniqueId}`.slice(0, 10),
        role: "instructor",
      });

    const instructorLoginRes = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: instructorEmail,
        password: "securepassword123",
      });
    instructorToken = instructorLoginRes.body.token;

    const studentEmail = `lesson_student${uniqueId}@gmail.com`;
    await request(app)
      .post("/api/user/register")
      .send({
        username: `lesson_student${uniqueId}`,
        email: studentEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: `8${uniqueId}`.slice(0, 10),
        role: "student",
      });

    const studentLoginRes = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: studentEmail,
        password: "securepassword123",
      });
    studentToken = studentLoginRes.body.token;

    const courseRes = await request(app)
      .post("/api/course")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Lesson Test Course ${uniqueId}`,
        description: "Course for lesson API tests",
      });
    courseId = courseRes.body.course.course_id;
  });

  it("should fail lesson fetch when token is missing", async () => {
    const res = await request(app).get(`/api/lesson/${courseId}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Authorization token missing");
  });

  it("should fail lesson creation when user is student", async () => {
    const res = await request(app)
      .post("/api/lesson")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Student Lesson",
        content: "Should not be allowed",
        courseId,
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Access denied: Instructors only");
  });

  it("should create lesson successfully", async () => {
    const res = await request(app)
      .post("/api/lesson")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Test Lesson",
        content: "Lesson content",
        courseId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.lesson).toHaveProperty("lesson_id");

    lessonId = res.body.lesson.lesson_id;
  });

  it("should fetch lessons successfully", async () => {
    const res = await request(app)
      .get(`/api/lesson/${courseId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.lessons)).toBe(true);
    expect(res.body.lessons.some((lesson) => lesson.lesson_id === lessonId)).toBe(true);
  });

  it("should update lesson successfully", async () => {
    const res = await request(app)
      .put(`/api/lesson/${lessonId}`)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Updated Lesson",
        content: "Updated lesson content",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.lesson.title).toBe("Updated Lesson");
  });

  it("should delete lesson successfully", async () => {
    const res = await request(app)
      .delete(`/api/lesson/${lessonId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Lesson deleted successfully");
  });
});
