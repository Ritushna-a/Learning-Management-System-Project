const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/Database");

describe("Register User API", () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  it("should register a new user successfully", async () => {
    const uniqueUsername = `testuser${Date.now()}`;
    const uniqueEmail = `test${Date.now()}@gmail.com`;
    const uniquePhone = `9${Date.now()}`.slice(0, 10);

    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: "securepassword123",
        confirmPassword: "securepassword123",
        phoneNumber: uniquePhone,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User registered successfully");
  });

  it("should fail when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        email: "missingfields@gmail.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All required fields must be filled");
  });

  it("should fail when passwords do not match", async () => {
    const res = await request(app)
      .post("/api/user/register")
      .send({
        username: "mismatchuser",
        email: `mismatch${Date.now()}@gmail.com`,
        password: "password123",
        confirmPassword: "password321",
        phoneNumber: "9812345678",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Passwords do not match");
  });
});
