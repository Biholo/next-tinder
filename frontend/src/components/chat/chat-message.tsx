import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from "@/models";

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isCurrentUser = message.isOwnMessage;

    return (
        <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder-${isCurrentUser ? 'user' : 'other'}.svg`} />
                <AvatarFallback>{isCurrentUser ? 'Vous' : 'Autre'}</AvatarFallback>
            </Avatar>
            
            <div className={`max-w-[70%] p-3 rounded-lg ${
                isCurrentUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}>
                <p className="break-words">{message.content}</p>
                <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default ChatMessage;