import { useState, useRef, useEffect } from "react"
import { ImageIcon, Smile } from "lucide-react"
import { wsService } from "@/services/websocketService"

interface MessageInputProps {
  onSendMessage: (content: string) => void
  matchId: string
  receiverId: string
}

export function MessageInput({ onSendMessage, matchId, receiverId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    // Envoyer un signal "en train d'écrire" avec un délai
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      wsService.sendTypingStatus(matchId, receiverId, true);
    }, 500); // Déclenche après 500ms sans frappe
  };


  //si la personne n'écrit plus, on envoie un signal "ne plus écrire"
  useEffect(() => {
    if (message.trim() === "") {
      wsService.sendTypingStatus(matchId, receiverId, false);
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    wsService.sendTypingStatus(matchId, receiverId, false);
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <Smile className="h-5 w-5" />
        </button>
        <input
          value={message}
          onChange={handleMessageChange}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:border-[#FF1B5B]"
          placeholder="Rédigez un message"
        />
      </div>
    </form>
  )
} 