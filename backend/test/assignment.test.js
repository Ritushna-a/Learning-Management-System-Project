const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/Database");

describe("Assignment API", () => {
  let instructorToken;
  let courseId;
  let assignmentId;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();
    const instructorEmail = `assignment_instructor${uniqueId}@gmail.com`;

    await request(app)
      .post("/api/user/register")
      .send({
        username: `assignment_instructor${uniqueId}`,
        email: instructorEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: `9${uniqueId}`.slice(0, 10),
        role: "instructor",
      });

    const loginRes = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: instructorEmail,
        password: "securepassword123",
      });

    instructorToken = loginRes.body.token;

    const courseRes = await request(app)
      .post("/api/course")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Assignment Test Course ${uniqueId}`,
        description: "Course for assignment API tests",
      });

    courseId = courseRes.body.course.course_id;
  });

  it("should create assignment successfully", async () => {
    const res = await request(app)
      .post("/api/assignment")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Test Assignment",
        description: "Assignment description",
        dueDate: "2027-01-01",
        courseId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.assignment).toHaveProperty("assignment_id");

    assignmentId = res.body.assignment.assignment_id;
  });

  it("should fetch single assignment successfully", async () => {
    const res = await request(app)
      .get(`/api/assignment/single/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assignment.assignment_id).toBe(assignmentId);
  });

  it("should update assignment successfully", async () => {
    const res = await request(app)
      .put(`/api/assignment/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "Updated Assignment",
        description: "Updated assignment description",
        dueDate: "2027-02-01",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Updated");
  });

  it("should delete assignment successfully", async () => {
    const res = await request(app)
      .delete(`/api/assignment/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Deleted");
  });
});
