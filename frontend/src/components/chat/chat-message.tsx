import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatMessagesProps {
  user: {
    name: string
    image?: string
  }
}

export function ChatMessages({ user }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex gap-2 items-start">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="bg-gray-100 rounded-2xl px-4 py-2">
          <p>Salut cv</p>
        </div>
      </div>
    </div>
  )
}

