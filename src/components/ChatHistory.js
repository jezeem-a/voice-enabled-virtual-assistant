import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '../lib/utils';

export default function ChatHistory({ chats, className }) {
  return (
    <ScrollArea className={cn("h-[calc(100vh-5rem)]", className)}>
      <div className="p-4 space-y-3">
        {chats.map((chat) => (
          <div key={chat.id}>
            <div
              className={cn(
                "max-w-[85%] p-3 rounded-md",
                chat.isUser
                  ? "bg-blue-500 text-white ml-auto rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              )}
            >
              {chat.text}
            </div>
            
            {/* Simple label */}
            <div 
              className={cn(
                "text-xs text-gray-400 mt-1",
                chat.isUser ? "text-right" : "text-left"
              )}
            >
              {chat.isUser ? 'You' : 'Assistant'}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}