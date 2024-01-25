import mongoose from "mongoose";
import app from "../app";
import "dotenv/config";
import request from "supertest";

const { DB_CONNECT_TEST } = process.env;

import { User } from "../models/users";

describe("test/api/auth/signUp", () => {
  let server = null;

  beforeAll(async () => {
    await mongoose.connect(DB_CONNECT_TEST);
    server = app.listen(3001);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test sing up with correct data", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signUp")
      .send(signUpData);

    expect(statusCode).toBe(201);

    expect(body.email).toBe(signUpData.email);

    const user = await User.findOne({ email: signUpData.email });

    expect(body).toEqual({
      email: user.email,
      subscription: "starter",
    });

    expect(user.email).toBe(signUpData.email);
  });

  test("Email already in use", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const { statusCode, body } = await request(app)
      .post("/api/auth/signUp")
      .send(signUpData);

    console.log(body);

    expect(statusCode).toBe(409);
    expect(body).toEqual({ message: "Email already in use" });

    // expect(() => statusCode === 409).toThrow("Email already in use");
  });
});
