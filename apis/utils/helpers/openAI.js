const { generateText } = require("ai");
const { createOpenAI } = require("@ai-sdk/openai");

const { OPENAI_API_KEY } = require("../../constants");

// Initialize OpenAI
const openai = createOpenAI({
  apiKey: OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
    You are a helpful assistant.

    You should help the users solve them their problems.
    If unsure what to reply, make sure to let them know that our support team will contact them.

    NOTE:
    1. Keep responses concise and natural for voice conversation.
    2. Make sure to ask for more context if the problem is unclear.
`;

const generateCallerResponse = async ({ prompt = "", messages = [] }) => {
  let response;

  try {
    if (prompt) {
      response = await generateText({
        model: openai("gpt-4o-mini"),
        temperature: 0.7,
        max_tokens: 4000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        system: SYSTEM_PROMPT,
        prompt,
      });
    } else if (messages && messages.length > 0) {
      response = await generateText({
        model: openai("gpt-4o-mini"),
        temperature: 0.7,
        max_tokens: 4000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages,
        ],
      });
    }
  } catch (e) {
    console.log("Error generating caller response: ", e);
  }

  return response;
};

module.exports = { generateCallerResponse };
