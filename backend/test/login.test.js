const request = require("supertest");
require("dotenv").config();
const app = require("../index");
const { sequelize } = require("../database/Database");

describe("Login User API", () => {
  let loginEmail;
  const loginPassword = "securepassword123";

  beforeAll(async () => {
    await sequelize.sync();
    loginEmail = `logintest${Date.now()}@gmail.com`;

    await request(app)
      .post("/api/user/register")
      .send({
        username: `logintest${Date.now()}`,
        email: loginEmail,
        password: loginPassword,
        confirmPassword: loginPassword,
        phoneNumber: `9${Date.now()}`.slice(0, 10),
      });
  });

  it("should login successfully with email", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: loginEmail,
        password: loginPassword,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(loginEmail);
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: loginEmail,
        password: "wrongpassword123",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should fail login when user does not exist", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({
        emailOrUsername: `nouser${Date.now()}@gmail.com`,
        password: "doesnotmatter",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
