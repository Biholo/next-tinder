import type { Match, User } from "@/types/chat"
import { MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ChatHeaderProps {
  match: Match
  otherUser: User
}

export function ChatHeader({ match, otherUser }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
        <img 
          src={otherUser.avatar || "/placeholder.svg"} 
          alt={otherUser.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-sm">
        Match avec {otherUser.name} le {format(match.matchedAt, "dd/MM/yyyy", { locale: fr })}
      </div>
      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
        <MoreHorizontal className="h-5 w-5" />
      </button>
    </div>
  )
} 