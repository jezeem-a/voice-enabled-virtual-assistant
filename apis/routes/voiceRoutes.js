const express = require("express");

const VoiceController = require("../controller/VoiceController");

const router = express.Router();

router.post("/get-solution", VoiceController.getUserSolution);
router.get("/chat-history", VoiceController.getChatHistory);

module.exports = router;
