const request = require("supertest");
require("dotenv").config();

const app = require("../index");
const { sequelize } = require("../database/Database");

describe("Enrollment API", () => {
  let instructorToken;
  let studentToken;
  let courseId;

  beforeAll(async () => {
    await sequelize.sync();

    const uniqueId = Date.now();

    const instructorEmail = `enroll_instructor${uniqueId}@gmail.com`;
    await request(app)
      .post("/api/user/register")
      .send({
        username: `enroll_instructor${uniqueId}`,
        email: instructorEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: `9${uniqueId}`.slice(0, 10),
        role: "instructor",
      });

    const instructorLogin = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: instructorEmail,
        password: "securepassword123",
      });
    instructorToken = instructorLogin.body.token;

    const courseRes = await request(app)
      .post("/api/course")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Enrollment Course ${uniqueId}`,
        description: "Course for enrollment tests",
      });
    courseId = courseRes.body.course.course_id;

    const studentEmail = `enroll_student${uniqueId}@gmail.com`;
    await request(app)
      .post("/api/user/register")
      .send({
        username: `enroll_student${uniqueId}`,
        email: studentEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: `8${uniqueId}`.slice(0, 10),
        role: "student",
      });

    const studentLogin = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: studentEmail,
        password: "securepassword123",
      });
    studentToken = studentLogin.body.token;
  });

  it("should enroll student in a course", async () => {
    const res = await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Enrolled successfully");
  });

  it("should not enroll same student twice", async () => {
    const res = await request(app)
      .post(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Already enrolled");
  });

  it("should list student's enrolled courses", async () => {
    const res = await request(app)
      .get("/api/enrollment/my-courses")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.enrollments)).toBe(true);
    expect(res.body.enrollments.length).toBeGreaterThan(0);
  });

  it("should unenroll student from course", async () => {
    const res = await request(app)
      .delete(`/api/enrollment/${courseId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Unenrolled successfully");
  });
});
