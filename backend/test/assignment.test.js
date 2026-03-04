const request = require("supertest");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Assignment API", () => {
  let instructorToken;
  let courseId;
  let assignmentId;

  beforeAll(async () => {
    const uniqueId = Date.now();
    const instructorEmail = `assignment_instructor${uniqueId}@gmail.com`;

    await request(BASE_URL)
      .post("/api/user/register")
      .send({
        username: `assignment_instructor${uniqueId}`,
        email: instructorEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: `9${uniqueId}`.slice(0, 10),
        role: "instructor",
      });

    const loginRes = await request(BASE_URL)
      .post("/api/user/login")
      .send({
        emailOrUsername: instructorEmail,
        password: "securepassword123",
      });

    instructorToken = loginRes.body.token;

    const courseRes = await request(BASE_URL)
      .post("/api/course")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: `Assignment Test Course ${uniqueId}`,
        description: "Course for assignment API tests",
      });

    courseId = courseRes.body.course.course_id;
  });

  it("should create assignment successfully", async () => {
    const res = await request(BASE_URL)
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
    const res = await request(BASE_URL)
      .get(`/api/assignment/single/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.assignment.assignment_id).toBe(assignmentId);
  });

  it("should update assignment successfully", async () => {
    const res = await request(BASE_URL)
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
    const res = await request(BASE_URL)
      .delete(`/api/assignment/${assignmentId}`)
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Deleted");
  });
});
