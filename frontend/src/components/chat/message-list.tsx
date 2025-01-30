import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  name: string
  image: string
  lastMessage: string
}

const messages: Message[] = [
  { name: "Emilie", image: "/placeholder.svg", lastMessage: "Salut cv" },
  { name: "Chris", image: "/placeholder.svg", lastMessage: "Salut 😊 le outfit sur la 2e pho..." },
  { name: "Axellya", image: "/placeholder.svg", lastMessage: "J'ai jamais vu inception" },
  { name: "Evelyn", image: "/placeholder.svg", lastMessage: "evelynfeng23" },
]

export function MessageList() {
  return (
    <>
      {messages.map((message) => (
        <div key={message.name} className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer">
          <Avatar className="h-12 w-12">
            <AvatarImage src={message.image} alt={message.name} />
            <AvatarFallback>{message.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">{message.name}</p>
            <p className="text-sm text-gray-500 truncate">{message.lastMessage}</p>
          </div>
        </div>
      ))}
    </>
  )
}

