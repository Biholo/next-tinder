import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message, User } from "@/models"

interface MessageListProps {
  messages: Message[]
  otherUser: User
}

export function MessageList({ messages, otherUser }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer">
          <Avatar className="h-12 w-12">
            <AvatarImage src={otherUser.photos[0]?.photoUrl || "/placeholder.svg"} alt={otherUser.firstName} />
            <AvatarFallback>{otherUser.firstName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{otherUser.firstName}</p>
            <p className="text-sm text-gray-500 truncate">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

