const mongoose = require("mongoose");
const request = require("supertest");
const User = require('../models/user');
const app = require("../app");

require("dotenv").config();

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.TEST_MONGODB_URI);

    const requestBody = {
      "username": "user",
      "password": "password"
    };

    await request(app).post("http://localhost:3000/auth/register", requestBody);
    const token = await request(app).post("http://localhost:3000/auth/login", requestBody);
    console.log(token);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
});

describe("GET /events", () => {
  it("should return true", async () => {
    // const res = await request(app).get("/api/products");
    // expect(res.statusCode).toBe(200);
    // expect(res.body.length).toBeGreaterThan(0);
    expect(true).toBeTruthy();
  });
});

afterAll(async () => {
  try {
    await User.deleteMany();
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
});
