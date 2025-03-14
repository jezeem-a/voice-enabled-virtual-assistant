const mongoose = require("mongoose");

// chat Schema
const chatSchema = new mongoose.Schema({
  sessionId: String, // Stores a unique session ID
  message: String,
  response: String,
  createdAt: { type: Date, default: Date.now, expires: "24h" } // Auto-delete after 24 hours
});

const ChatModal =  mongoose.model("Chat", chatSchema);

module.exports = ChatModal;
