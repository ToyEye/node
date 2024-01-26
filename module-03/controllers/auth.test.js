import mongoose from "mongoose";
import app from "../app";
import "dotenv/config";
import request from "supertest";
import bcrypt from "bcryptjs";

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

    expect(statusCode).toBe(409);
    expect(body).toEqual({ message: "Email already in use" });
  });

  test("Password is required", async () => {
    const signUpData = {
      email: "email@gmail.com",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signUp")
      .send(signUpData);

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: '"password" is required' });
  });

  test("Email is required", async () => {
    const signUpData = {
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/signUp")
      .send(signUpData);

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: '"email" is required' });
  });

  test("Body must have fields", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/signUp")
      .send();

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: "Body must have fields" });
  });
});

describe("test/api/auth/login", () => {
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

    await request(app).post("/api/auth/signUp").send(signUpData);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send(signUpData);

    expect(statusCode).toBe(200);
    expect(body.token).toBe(body.token);
    expect(body.user).toEqual({
      email: body.user.email,
      subscription: body.user.subscription,
    });
  });

  test("testing body must have fields", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send();

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: "Body must have fields" });
  });

  test("password id required", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ email: signUpData.email });

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: '"password" is required' });
  });

  test("email is required", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ password: signUpData.password });

    expect(statusCode).toBe(400);
    expect(body).toEqual({ message: '"email" is required' });
  });

  test("test Correct data", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ email: "email2@gmail.com", password: signUpData.password });

    expect(statusCode).toBe(401);
    expect(body.message).toBe("Email or password invalid ");
  });

  test("test compare password", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const user = await User.findOne({ email: signUpData.email });

    const comparePassword = await bcrypt.compare("123466", user.password);

    const { statusCode, body } = await request(app)
      .post("/api/auth/login")
      .send({ email: signUpData.email, password: "123466" });

    expect(comparePassword).toBe(false);
    expect(statusCode).toBe(401);
    expect(body.message).toBe("Email or password invalid ");
  });
});

describe("test/api/auth/logout", () => {
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

  test("logout success", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    await request(app).post("/api/auth/signUp").send(signUpData);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(signUpData);

    expect(loginResponse.statusCode).toBe(200);
    const token = loginResponse.body.token;

    const { statusCode, body } = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(statusCode).toBe(200);
    expect(body.message).toBe("logout success");
  });

  test("unauthorized", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/auth/logout")
      .send();

    expect(statusCode).toBe(401);
    expect(body.message).toBe("Unauthorized");
  });
});

describe("test/api/auth/changeSubscribe", () => {
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

  test("correct change", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    const subscription = "pro";

    await request(app).post("/api/auth/signUp").send(signUpData);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(signUpData);

    expect(loginResponse.statusCode).toBe(200);
    const token = loginResponse.body.token;

    const { statusCode, body } = await request(app)
      .patch("/api/auth/subscription")
      .set("Authorization", `Bearer ${token}`)
      .send({ subscription });

    expect(statusCode).toBe(200);
    expect(body.message).toBe("subscription changed");
  });

  test("unauthorized", async () => {
    const subscription = "pro";

    const { statusCode, body } = await request(app)
      .patch("/api/auth/subscription")
      .send({ subscription });

    expect(statusCode).toBe(401);
    expect(body.message).toBe("Unauthorized");
  });

  test("one of list", async () => {
    const signUpData = {
      email: "email@gmail.com",
      password: "123456",
    };

    const subscription = "tester";

    await request(app).post("/api/auth/signUp").send(signUpData);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(signUpData);

    expect(loginResponse.statusCode).toBe(200);
    const token = loginResponse.body.token;

    const { statusCode, body } = await request(app)
      .patch("/api/auth/subscription")
      .set("Authorization", `Bearer ${token}`)
      .send({ subscription });

    expect(statusCode).toBe(400);
    expect(body.message).toBe(
      '"subscription" must be one of [starter, pro, business]'
    );
  });
});
