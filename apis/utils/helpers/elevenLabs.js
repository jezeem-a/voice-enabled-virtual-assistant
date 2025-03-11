const fs = require("fs");
const path = require("path");
const { ElevenLabsClient } = require("elevenlabs");
const { ELEVENLABS_API_KEY } = require("../../constants");

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const generateAudioFromText = async ({ text, voiceId }) => {
  if (!text) return { error: "Text is required to generate the audio." };

  try {
    // Generate audio using ElevenLabs
    const audioStream = await elevenlabs.generate({
      text: text,
      voiceId: voiceId || "JBFqnCBsd6RMkjVDRZzb",
      modelId: "eleven_multilingual_v2",
      outputFormat: "mp3_44100_128",
    });

    return { audioStream };
  } catch (error) {
    return { error: "Error generating audio stream" };
  }
};

const saveAudioStream = async ({ audioStream }) => {
  if (!audioStream)
    return { error: "Audio is required in order to save it." };

  try {
    // Generate unique filename
    const filename = `speech_${Date.now()}.mp3`;
    const audioDir = path.join(__dirname, "../../public/audio");
    const filepath = path.join(audioDir, filename);

    // Ensure audio directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Create write stream
    const writeStream = fs.createWriteStream(filepath);

    // Read chunks from the stream and write to file
    const reader = audioStream.reader;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      writeStream.write(value);
    }

    // Close the write stream
    writeStream.end();

    return { audioUrl: `/audio/${filename}` };
  } catch (error) {
    return { error: "Error saving audio stream" };
  }
};

module.exports = {
  generateAudioFromText,
  saveAudioStream,
};
