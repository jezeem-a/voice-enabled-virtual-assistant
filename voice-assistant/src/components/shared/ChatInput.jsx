import React, { useState, useRef } from "react";

const mimeToExtension = {
  'audio/webm': 'webm',
  'audio/wav': 'wav',
  'audio/mp4': 'm4a',
};

const ChatInput = () => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [translationStatus, setTranslationStatus] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const detectLanguage = async (audioBlob, mimeType) => {
    try {
      const formData = new FormData();
      const extension = mimeToExtension[mimeType] || 'webm';
      formData.append('file', audioBlob, `audio.${extension}`);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Language detection error:', error);
        throw new Error('Failed to detect language');
      }

      const data = await response.json();
      if (data.language) {
        const detectedLang = data.language.toLowerCase();
        console.log('Detected language in detectLanguage:', detectedLang);
        setDetectedLanguage(detectedLang.toUpperCase());
        return detectedLang.toUpperCase();
      }
    } catch (err) {
      console.error('Error detecting language:', err);
    }
    return null;
  };

  const convertAudioToText = async (audioBlob, mimeType) => {
    try {
      setIsProcessingAudio(true);

      // First, ensure we have the latest language detection
      const currentLanguage = await detectLanguage(audioBlob, mimeType);
      console.log('Current language before translation:', currentLanguage);

      const formData = new FormData();
      const extension = mimeToExtension[mimeType] || 'mp3';
      formData.append('file', audioBlob, `audio.${extension}`);
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      formData.append('prompt', `Translate to English while preserving all technical terms (like API names, programming languages, frameworks, technical concepts). 
After translation, analyze the content to identify if the user is describing a website, mobile app, desktop application, or other software project. 
If the project type is not explicitly mentioned, add the appropriate term based on context.`);

      // Use translations endpoint only if language is not English
      const isNonEnglish = currentLanguage && currentLanguage.toLowerCase() !== 'en';
      const endpoint = isNonEnglish
        ? 'https://api.openai.com/v1/audio/translations'
        : 'https://api.openai.com/v1/audio/transcriptions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to convert audio to text');
      }

      const data = await response.json();
      setInputText(data.text);

      if (isNonEnglish && data.text.trim()) {
        setTranslationStatus(`Translated from ${currentLanguage}`);
      } else {
        setTranslationStatus('');
      }

    } catch (err) {
      console.error('Error converting audio to text:', err);
      alert('Failed to convert audio to text. Please try typing instead.');
      setInputText('');
      setTranslationStatus('');
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorderRef.current.mimeType });
        await convertAudioToText(audioBlob, mediaRecorderRef.current.mimeType);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playAudioResponse = async (text) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/voice/get-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text })
      });

      if (!response.ok) {
        throw new Error('Failed to get audio response');
      }

      // Get the audio stream from the response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl); // Clean up the URL
      };
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      alert('Failed to play audio response');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      await playAudioResponse(inputText);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border rounded-lg">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="Type or speak your message..."
      />
      <button
        type="button"
        onClick={toggleListening}
        disabled={isProcessingAudio}
        className={`p-2 rounded-full ${
          isListening ? "bg-red-500" : "bg-blue-500"
        } text-white ${isProcessingAudio ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      <button
        type="submit"
        disabled={!inputText.trim() || isProcessingAudio}
        className={`p-2 rounded-full bg-green-500 text-white ${
          (!inputText.trim() || isProcessingAudio) ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isPlaying ? (
          // Playing icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          // Send/Play icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347c-.75.412-1.667-.13-1.667-.986V5.653z"
            />
          </svg>
        )}
      </button>
      {translationStatus && (
        <div className="text-sm text-gray-500 ml-2">{translationStatus}</div>
      )}
    </form>
  );
};

export default ChatInput;
