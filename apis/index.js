require("dotenv").config();
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

// const { SERVER_PORT } = require("./constants");
SERVER_PORT = process.env.PORT || 5000;
const { createDirectoryIfNotExists } = require("./utils/helpers/files");
const voiceRoutes = require('./routes/voiceRoutes');
dotenv.config({ path: "./.env" });
const connectToDB = require("./config/db");

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

connectToDB();

// Define the public folder path
const publicPath = path.join(__dirname, "public");
createDirectoryIfNotExists(publicPath)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  return res
    .status(400)
    .json({ status: false, message: "Welcome to Voice Assistant API." });
});

app.use("/api/voice", voiceRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
