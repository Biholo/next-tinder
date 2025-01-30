"use client"

import { useState } from "react"
import { Users, Briefcase, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Sample data
const messages = [
  {
    id: 1,
    name: "Sabrina",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uQSQCWyeL4023sghlhqyHEZLhpLHZ8.png",
    message: "Activité récente, matche dès maintenant !",
    online: true,
    likes: true,
  },
  {
    id: 2,
    name: "Emilie",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uQSQCWyeL4023sghlhqyHEZLhpLHZ8.png",
    message: "Salut cv",
    online: false,
  },
  {
    id: 3,
    name: "Chris",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uQSQCWyeL4023sghlhqyHEZLhpLHZ8.png",
    message: "Salut 👋 le outfit sur la 2e pho...",
    online: false,
  },
  {
    id: 4,
    name: "Axeliya",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uQSQCWyeL4023sghlhqyHEZLhpLHZ8.png",
    message: "J'ai jamais vu inception",
    online: true,
  },
  {
    id: 5,
    name: "Evelyn",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uQSQCWyeL4023sghlhqyHEZLhpLHZ8.png",
    message: "evelynfeng23",
    online: false,
  },
]

const matches = [
  { id: 1, name: "3 Likes", likes: 3, badge: "⭐️" },
  {
    id: 2,
    name: "Lea",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 3,
    name: "Nawres",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 4,
    name: "Marie-Emeli...",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 5,
    name: "Michelle",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 6,
    name: "Nonma",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 7,
    name: "Marine",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 8,
    name: "Diana",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
  {
    id: 9,
    name: "Jade",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png",
  },
]

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("messages")
  const navigate = useNavigate();

  return (
    <div className="w-[380px] flex flex-col h-screen border-r border-gray-200">
      {/* Header */}
      <div className="h-16 bg-[#FF385C] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer "
          onClick={() => navigate('/profile')}
        >
          <div
            className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-WkTkdakVMdye1gW9oUcewo2sqvFLBw.png"
              alt="Kilian"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium text-white">Kilian</span>
        </div>
        <div className="flex items-center gap-4">
          {[Users, 
          // Briefcase, Shield
        ].map((Icon, index) => (
            <button 
            key={index} 
            className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            onClick={() => navigate('/')}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {["matchs", "messages"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === tab ? "text-[#FF385C] border-b-2 border-[#FF385C]" : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "matchs" && (
          <div className="grid grid-cols-3 gap-1 p-1">
            {matches.map((match) => (
              <div 
              key={match.id} 
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
              onClick={() => navigate(`/chat/${match.id}`)}
              >
                {match.image ? (
                  <img
                    src={match.image || "/placeholder.svg"}
                    alt={match.name}
                    className="h-full w-full object-cover transition-transform hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-yellow-100 text-yellow-900">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{match.likes}</div>
                      <div className="text-sm">{match.name}</div>
                      <div className="text-lg">{match.badge}</div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="truncate rounded bg-black/40 px-2 py-0.5 text-center text-sm font-medium text-white">
                    {match.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="flex flex-col">
            {messages.map((message) => (
              <div 
              key={message.id} 
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/chat/${message.id}`)}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={message.image || "/placeholder.svg"}
                      alt={message.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {message.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}
                </div>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{message.name}</span>
                    {message.likes && (
                      <span className="px-1 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                        LIKES YOU
                      </span>
                    )}
                  </div>
                  <span className="truncate text-sm text-gray-500">{message.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

