const express = require("express");

const VoiceController = require("../controller/VoiceController");

const router = express.Router();

router.post("/get-solution", VoiceController.getUserSolution);

module.exports = router;
