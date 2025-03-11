require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const express = require("express");

const { SERVER_PORT } = require("./constants");
const { createDirectoryIfNotExists } = require("./utils/helpers/files");

const app = express();

// Middlewares declaration
let corsOptions = {
  origin: true,
  methods: ["GET", "PUT", "POST", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// Middleware to parse Twilio webhook requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Define the public folder path
const publicPath = path.join(__dirname, "public");
createDirectoryIfNotExists(publicPath)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res
    .status(400)
    .json({ status: false, message: "Welcome to Voice Assistant API." });
});
// app.use("/api/leads", leadRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
