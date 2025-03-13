const mongoose = require("mongoose");

// chat Schema
const chatSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const ChatModal =  mongoose.model("Chat", chatSchema);

module.exports = ChatModal;
