import app from "./app.js";
import mongoose from "mongoose";

const DB = process.env.DB_CONNECT;

mongoose
  .connect(DB)
  .then(() => {
    app.listen(3001, () => {
      console.log("Server is running. Use our API on port: 3001");
    });
    console.log("Connected to database");
  })
  .catch(() => {
    process.exit(1);
  });
