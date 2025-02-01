import { formatMessageDate } from "@/utils/dateFormatter";

interface MessageBubbleProps {
  message: {
    content: string;
    createdAt: Date | string | number;
    senderId: string;
  };
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formattedDate = formatMessageDate(message.createdAt || new Date());

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn ? "bg-[#FF385C] text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="break-words">{message.content}</p>
        <p className={`text-xs mt-1 ${isOwn ? "text-white/80" : "text-gray-500"}`}>
          {formattedDate}
        </p>
      </div>
    </div>
  );
} 