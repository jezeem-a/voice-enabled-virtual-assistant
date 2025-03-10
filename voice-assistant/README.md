# Voice Assistant UI

A voice-enabled virtual assistant UI built with React, TypeScript, and Tailwind CSS.

## Features

- Voice recognition interface similar to Siri or Google Assistant
- Visual voice animation that responds to speech
- Real-time speech-to-text transcription
- Chat history interface
- Responsive design for both desktop and mobile
- Styled using Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- NPM (v6 or higher)

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Browser Support

The voice recognition functionality uses the Web Speech API, which is supported in most modern browsers like Chrome, Edge, and Safari. Firefox support may be limited.

## Project Structure

```
src/
├── components/           # UI components
│   ├── ui/               # Reusable UI components
│   ├── ChatHistory.tsx   # Chat history display
│   ├── ChatMessage.tsx   # Individual chat message
│   ├── VoiceAnimation.tsx # Voice animation visualization
│   └── VoiceAssistant.tsx # Main voice assistant component
├── types/                # TypeScript type definitions
│   └── chat.ts           # Chat-related types
├── utils/                # Utility functions
│   ├── cn.ts             # Tailwind class merging utility
│   └── speechRecognition.ts # Speech recognition utilities
├── App.tsx               # Main app component
└── index.tsx             # Entry point
```

## Technologies Used

- React.js
- TypeScript
- Tailwind CSS
- Web Speech API
- Lucide React (for icons)
- Class Variance Authority (for component styling)

## Future Enhancements

- Connect to a real AI backend for responses
- Add voice output for assistant responses
- Add more voice visualization options
- Implement voice commands for specific actions
- Add themes and customization options

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## License

MIT