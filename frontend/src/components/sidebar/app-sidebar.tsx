"use client"

import { useState, useEffect } from "react"
import { Users, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getMatches } from "@/redux/slices/matcheSlice"
import { useAppSelector } from "@/hooks/useAppSelector"

interface Match {
  _id: string
  user1_id: string
  user2_id: string
  createdAt: string
  updatedAt: string
  match_id: string
  user: {
    firstName: string
    photos: { photoUrl: string }[]
  }
  lastMessage?: {
    content: string
  }
}

interface Message {
  _id: string
  matchId: string
  senderId: string
  content: string
  createdAt: string
  updatedAt: string
}

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("messages")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { matches } = useAppSelector((state) => state.matches)

  // Séparer les matches avec et sans messages
  const matchesWithMessages = matches.filter((match) => match.lastMessage)
  const matchesWithoutMessages = matches.filter((match) => !match.lastMessage)

  useEffect(() => {
    const fetchMatches = async () => {
      await dispatch(getMatches())
    }
    fetchMatches()
  }, [dispatch])

  return (
    <div className="w-80 flex flex-col h-screen border-r border-gray-200">
      {/* Header */}
      <div className="h-16 bg-[#FF385C] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            {user?.photos && user.photos[0] ? (
              <img
                src={user.photos[0].photoUrl || "/placeholder.svg"}
                alt={`Photo de ${user.firstName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-500" />
              </div>
            )}
          </div>
          <span className="font-medium text-white">{user?.firstName || "Utilisateur"}</span>
        </div>
        <div className="flex items-center gap-4">
          {[Users].map((Icon, index) => (
            <button
              key={index}
              className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
              onClick={() => navigate("/")}
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
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === tab ? "text-[#FF385C] border-b-2 border-[#FF385C]" : "text-gray-500 hover:text-gray-700"
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
            {matchesWithoutMessages.map((match) => (
              <div
                key={match.match_id}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                onClick={() => navigate(`/chat/${match.match_id}`)}
              >
                <img
                  src={match.user.photos[0]?.photoUrl || "/placeholder.svg"}
                  alt={match.user.firstName}
                  className="h-full w-full object-cover transition-transform hover:scale-110"
                />
                <div className="absolute bottom-1 left-1 right-1">
                  <div className="truncate rounded bg-black/40 px-2 py-0.5 text-center text-sm font-medium text-white">
                    {match.user.firstName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="flex flex-col">
            {matchesWithMessages.map((match) => (
              <div
                key={match.match_id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/chat/${match.match_id}`)}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={match.user.photos[0]?.photoUrl || "/placeholder.svg"}
                      alt={match.user.firstName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{match.user.firstName}</span>
                  </div>
                  <span className="truncate text-sm text-gray-500">{match.lastMessage?.content}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

