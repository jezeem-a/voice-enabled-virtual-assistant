import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from './components/SpeechRecognition';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';
import VoiceWave from './components/VoiceWave';
import ChatHistory from './components/ChatHistory';
import { Mic, MicOff } from 'lucide-react';
import { cn } from './lib/utils';

function App() {
  // Speech recognition hook
  const { transcript, isListening, toggleListening, resetTranscript } = useSpeechRecognition();
  const [chats, setChats] = useState([
    { id: 1, text: "Hello, how can I help you today?", isUser: false },
  ]);
  
  useEffect(() => {
    // Process transcript when user stops speaking
    if (!isListening && transcript) {
      // Add user message
      const userMessage = {
        id: Date.now(),
        text: transcript,
        isUser: true
      };
      
      // Add bot response (mock)
      const botMessage = {
        id: Date.now() + 1,
        text: getAssistantResponse(transcript),
        isUser: false
      };
      
      setChats(prev => [...prev, userMessage, botMessage]);
      resetTranscript();
    }
  }, [isListening, resetTranscript, transcript]);
  
  // Mock response generator
  const getAssistantResponse = (text) => {
    text = text.toLowerCase();
    
    if (text.includes('weather')) {
      return "It's currently 72°F and sunny in your location.";
    } else if (text.includes('reminder') || text.includes('meeting')) {
      return "I've set a reminder for your meeting.";
    } else if (text.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (text.includes('hello') || text.includes('hi')) {
      return "Hello! How can I help you today?";
    } else {
      return "I'm not sure how to help with that yet. Is there anything else you'd like to know?";
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 bg-white hidden lg:block">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Chat History</h2>
        </div>
        <ChatHistory chats={chats} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-blue-50">
        <Card className="w-full max-w-xl shadow-lg border-0 overflow-hidden">
          <CardHeader className={cn(
            "text-center transition-all duration-500",
            isListening ? "pb-0" : "pb-4"
          )}>
            <CardTitle className="text-3xl font-bold text-blue-600">Voice Assistant</CardTitle>
            <CardDescription className="text-slate-600">
              {isListening 
                ? "I'm listening to you..." 
                : "Tap the microphone and start speaking"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4 px-0 pt-2">
            {/* Voice Visualization - takes more space when listening */}
            <VoiceWave isListening={isListening} className={isListening ? "mt-2" : ""} />
            
            {/* Current Transcript - more prominent when active */}
            {isListening && transcript && (
              <div className="mx-6 p-4 bg-blue-50 text-blue-700 rounded-md border border-blue-100 shadow-sm text-center">
                <p className="text-sm text-blue-400 mb-1">I heard:</p>
                <p className="font-medium">"{transcript}"</p>
              </div>
            )}
            
            {/* Mobile Chat History (visible on small screens) */}
            <div className={cn(
              "lg:hidden mx-6",
              isListening ? "opacity-60" : "opacity-100"  
            )}>
              <h3 className="text-sm font-medium text-slate-500 mb-2">Recent Messages</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {chats.slice(-3).map(chat => (
                  <div
                    key={chat.id}
                    className={`p-3 rounded-md ${
                      chat.isUser
                        ? "bg-blue-500 text-white ml-auto rounded-br-none max-w-[80%]"
                        : "bg-gray-100 text-gray-800 rounded-bl-none max-w-[80%]"
                    }`}
                  >
                    {chat.text}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pb-8">
            <Button 
              variant="primary"
              size="circle"
              onClick={toggleListening}
              className={cn(
                "shadow-lg transition-all duration-300 z-10",
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 ripple-effect scale-110' 
                  : 'bg-blue-500 hover:bg-blue-600'
              )}
            >
              {isListening 
                ? <MicOff className="h-6 w-6" /> 
                : <Mic className="h-6 w-6" />}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

export default App;