const {
  generateAudioFromText,
  saveAudioStream,
} = require("../utils/helpers/elevenLabs");
const { generateCallerResponse } = require("../utils/helpers/openAI");
const ChatModal = require("../models/chat");

const VoiceController = {
  getUserSolution: async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res
          .status(400)
          .json({ status: false, message: "Please provide the prompt." });
      }

      const callerResponse = await generateCallerResponse({
        prompt,
      });
      if (!callerResponse || (callerResponse && !callerResponse.text)) {
        throw new Error("Failed to analyze user prompt.");
      }
      const { text: text_input } = callerResponse;
      
      const task = await ChatModal.create({ text: text_input });

      const { audioStream, error: audioError } = await generateAudioFromText({
        text: text_input,
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
      });
      if (audioError) {
        throw new Error(audioError);
      }

      const { audioUrl, error: audioSaveError } = await saveAudioStream({
        audioStream,
      });
      if (audioSaveError) {
        throw new Error(audioSaveError);
      }

      return res.status(200).json({
        status: true,
        audioUrl,
        message: "Converted user input to audio successfully.",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: false,
        message: "Something went wrong in the server.",
      });
    }
  },
};

module.exports = VoiceController;
