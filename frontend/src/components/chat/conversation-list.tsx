import type { Match } from "@/models/chat"

interface ConversationListProps {
  matches: Match[]
  selectedMatchId?: string
  onSelectMatch: (matchId: string) => void
}

export function ConversationList({ matches, selectedMatchId, onSelectMatch }: ConversationListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {matches.map((match) => {
          const otherUser = match.otherUser
          if (!otherUser) return null

          return (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match.id)}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#F0F2F5] cursor-pointer transition-colors ${
                match.id === selectedMatchId ? "bg-[#F0F2F5]" : ""
              }`}
            >
              <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src={otherUser.avatar || "/placeholder.svg"} 
                  alt={otherUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium">{otherUser.name}</div>
                {match.lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    {match.lastMessage.content}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 