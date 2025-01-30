import type { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
  isOwn?: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : ''}`}>
      <div
        className={`rounded-2xl px-4 py-2 max-w-[80%] ${
          isOwn ? 'bg-primary text-white' : 'bg-[#F0F2F5]'
        }`}
      >
        <p className="break-words">{message.content}</p>
        <span className={`text-xs ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
} 