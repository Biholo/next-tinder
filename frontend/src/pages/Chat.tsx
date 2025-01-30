"use client"

import { useState } from "react"
import { ChatHeader } from "../components/chat/chat-header"
import { ConversationList } from "../components/chat/conversation-list"
import { MessageInput } from "../components/chat/message-input"
import { MessageBubble } from "../components/chat/message-bubble"
import { ProfilePanel } from "../components/chat/profile-panel"
import { Users, Heart } from "lucide-react"
import { wsService } from '../services/websocket';

// Mock data - replace with your actual data and types
const mockUser = {
  id: "1",
  name: "Axellya",
  age: 21,
  avatar: "/placeholder.svg",
  location: "à 14 kilomètres",
  languages: ["Français", "Portugais"],
  bio: "Je suis bon public, tu risques pas de bider.",
}

const mockMatches = [
  {
    id: "1",
    matchedAt: new Date("2024-05-30"),
    otherUser: mockUser,
    lastMessage: {
      id: "msg1",
      content: "J'ai jamais vu inception",
      timestamp: new Date(),
      senderId: "2",
    },
  },
]

export default function ChatPage() {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(mockMatches[0].id)
  const [messages, setMessages] = useState<any[]>([mockMatches[0].lastMessage])
  const selectedMatch = mockMatches.find((m) => m.id === selectedMatchId)

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      senderId: "1",
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <div className="fixed inset-0 flex bg-white">
      {/* Left Sidebar */}
      <div className="w-[320px] flex-shrink-0 border-r flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            <img src="/placeholder.svg" alt="Your profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Users className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button className="flex-1 py-3 px-4 text-center border-b-2 border-[#FF1B5B] text-[#FF1B5B] font-medium">
            Matchs
          </button>
          <button className="flex-1 py-3 px-4 text-center text-gray-500">Messages</button>
        </div>

        {/* Conversation List */}
        <ConversationList matches={mockMatches} selectedMatchId={selectedMatchId} onSelectMatch={setSelectedMatchId} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedMatch && (
          <>
            <ChatHeader match={selectedMatch} otherUser={selectedMatch.otherUser} />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} isOwn={message.senderId === "1"} />
              ))}
            </div>

            <MessageInput onSendMessage={handleSendMessage} />
          </>
        )}
      </div>

      {/* Right Sidebar - Profile Panel */}
      <div className="w-[320px] flex-shrink-0 border-l">
        {selectedMatch && <ProfilePanel user={selectedMatch.otherUser} />}
      </div>
    </div>
  )
}