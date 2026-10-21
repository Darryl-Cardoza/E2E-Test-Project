process.env.JWT_SECRET = "unit-test-secret-that-is-long-enough";

jest.mock("../src/models/User", () => ({
  exists: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const app = require("../src/app");

const account = { _id: { toString: () => "user-123" }, name: "Alex Morgan", email: "alex@example.com", createdAt: new Date("2026-01-01T00:00:00.000Z") };

describe("authentication API", () => {
  beforeEach(() => jest.clearAllMocks());

  test("registers a user and returns a signed token", async () => {
    User.exists.mockResolvedValue(null);
    User.create.mockResolvedValue(account);

    const response = await request(app).post("/api/auth/register").send({ name: " Alex Morgan ", email: "Alex@Example.com", password: "password123" });

    expect(response.status).toBe(201);
    expect(User.create).toHaveBeenCalledWith({ name: "Alex Morgan", email: "alex@example.com", password: "password123" });
    expect(response.body.user).toMatchObject({ id: "user-123", name: "Alex Morgan", email: "alex@example.com" });
    expect(jwt.verify(response.body.token, process.env.JWT_SECRET).sub).toBe("user-123");
  });

  test("rejects an invalid registration before accessing the database", async () => {
    const response = await request(app).post("/api/auth/register").send({ name: "A", email: "not-an-email", password: "short" });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/name must be/i);
    expect(User.exists).not.toHaveBeenCalled();
  });

  test("rejects an email that is already registered", async () => {
    User.exists.mockResolvedValue({ _id: "existing" });

    const response = await request(app).post("/api/auth/register").send({ name: "Alex Morgan", email: "alex@example.com", password: "password123" });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already exists/i);
  });

  test("logs in with a correct password and returns a token", async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ ...account, comparePassword: jest.fn().mockResolvedValue(true) }) });

    const response = await request(app).post("/api/auth/login").send({ email: "ALEX@EXAMPLE.COM", password: "password123" });

    expect(response.status).toBe(200);
    expect(User.findOne).toHaveBeenCalledWith({ email: "alex@example.com" });
    expect(response.body.user.email).toBe("alex@example.com");
    expect(jwt.verify(response.body.token, process.env.JWT_SECRET).sub).toBe("user-123");
  });

  test("rejects incorrect login credentials", async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ ...account, comparePassword: jest.fn().mockResolvedValue(false) }) });

    const response = await request(app).post("/api/auth/login").send({ email: "alex@example.com", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/incorrect/i);
  });

  test("returns the current profile only with a valid bearer token", async () => {
    User.findById.mockResolvedValue(account);
    const token = jwt.sign({}, process.env.JWT_SECRET, { subject: "user-123" });

    const response = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe("user-123");
  });

  test("rejects requests to the profile without a bearer token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(User.findById).not.toHaveBeenCalled();
  });
});
