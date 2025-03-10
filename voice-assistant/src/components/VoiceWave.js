import React from 'react';
import { cn } from '../lib/utils';

export default function VoiceWave({ isListening, className }) {
  return (
    <div className={cn(
      "relative w-full mx-auto rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500",
      isListening ? "h-48 bg-gradient-to-b from-blue-50 to-blue-100" : "h-24 bg-slate-50",
      className
    )}>
      {/* Background subtle waves when listening */}
      {isListening && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute w-full h-full bg-blue-300 rounded-full blur-3xl animate-pulse" 
               style={{transform: 'scale(0.8)', animationDuration: '3s'}} />
          <div className="absolute w-full h-full bg-indigo-300 rounded-full blur-3xl animate-pulse" 
               style={{transform: 'scale(0.6)', animationDuration: '4s', animationDelay: '0.5s'}} />
        </div>
      )}

      {/* Main pulsing circle */}
      <div 
        className={cn(
          "rounded-full transition-all duration-500 z-10",
          isListening 
            ? "w-28 h-28 bg-blue-500 ripple-effect shadow-lg shadow-blue-300/50" 
            : "w-16 h-16 bg-blue-200"
        )}
      />

      {/* The circular dots around the center */}
      {isListening && (
        <>
          {/* First ring of dots */}
          <div className="absolute w-40 h-40 animate-spin" style={{animationDuration: '8s'}}>
            {[...Array(16)].map((_, index) => (
              <div
                key={`outer-${index}`}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  transform: `rotate(${index * (360/16)}deg) translateY(-20px)`,
                  animation: `pulse 2s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </div>
          
          {/* Second ring of dots (smaller, opposite direction) */}
          <div className="absolute w-52 h-52 animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}}>
            {[...Array(24)].map((_, index) => (
              <div
                key={`inner-${index}`}
                className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
                style={{
                  transform: `rotate(${index * (360/24)}deg) translateY(-26px)`,
                  animation: `pulse 3s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.15}s`,
                }}
              />
            ))}
          </div>
          
          {/* Message that appears when listening */}
          <div className="absolute bottom-4 text-center text-blue-700 font-medium animate-pulse">
            AI is actively listening...
          </div>
        </>
      )}
    </div>
  );
}