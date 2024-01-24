import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";

import contactRoute from "./routes/contactsRoute.js";
import usersRoute from "./routes/usersRoute.js";

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use("/api/contacts", contactRoute);
app.use("/api/auth", usersRoute);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
