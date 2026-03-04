const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/Database");

describe("Course API", () => {
  let instructorToken;
  let studentToken;

  beforeAll(async () => {
    await sequelize.sync();
    const uniqueId = Date.now();

    const instructorEmail = `instructor${uniqueId}@gmail.com`;
    await request(app)
      .post("/api/user/register")
      .send({
        username: `instructor${uniqueId}`,
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

    const studentEmail = `student${uniqueId}@gmail.com`;
    await request(app)
      .post("/api/user/register")
      .send({
        username: `student${uniqueId}`,
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
  });

  it("should fail creating course when user is student", async () => {
    const res = await request(app)
      .post("/api/course")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Student Course",
        description: "Should not be allowed",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Access denied: Instructors only");
  });

  it("should fail creating course when fields are missing", async () => {
    const res = await request(app)
      .post("/api/course")
      .set("Authorization", `Bearer ${instructorToken}`)
      .send({
        title: "",
        description: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields required");
  });

  it("should fetch courses successfully", async () => {
    const res = await request(app)
      .get("/api/course")
      .set("Authorization", `Bearer ${instructorToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.courses)).toBe(true);
  });
});
