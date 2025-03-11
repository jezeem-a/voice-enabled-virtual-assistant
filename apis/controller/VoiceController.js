const {
  generateAudioFromText,
  saveAudioStream,
} = require("../utils/helpers/elevenLabs");
const { generateCallerResponse } = require("../utils/helpers/openAI");

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

      const { audioStream, error: audioError } = await generateAudioFromText({
        text: text_input,
        voiceId: "JBFqnCBsd6RMkjVDRZzb",
      });
      if (audioError) {
        throw new Error(audioError);
      }

      // const { audioUrl, error: audioSaveError } = await saveAudioStream({
      //   audioStream,
      // });
      // if (audioSaveError) {
      //   throw new Error(audioSaveError);
      // }
      // Set appropriate headers for audio streaming
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Transfer-Encoding', 'chunked');

      // return res.status(200).json({
      //   status: true,
      //   // audioUrl,
      //   audioUrl: "",
      //   message: "Converted user input to audio successfully.",
      // });
      
      // Stream the audio directly to the client
      audioStream.pipe(res);

      // Handle any errors during streaming
      audioStream.on('error', (error) => {
        console.error('Error streaming audio:', error);
        // Only send error if headers haven't been sent
        if (!res.headersSent) {
          res.status(500).json({
            status: false,
            message: "Error streaming audio response",
          });
        }
      });

    } catch (err) {
      console.error('Error in getUserSolution:', err);
      // Only send error if headers haven't been sent
      if (!res.headersSent) {
        res.status(500).json({
          status: false,
          message: err.message || "Failed to process voice response",
        });
      }
    }
  }
};

module.exports = VoiceController;
