"use client"

import { useState, useEffect } from "react"
import { Users, User, Pencil } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getMatches } from "@/redux/slices/matcheSlice"
import { useAppSelector } from "@/hooks/useAppSelector"
import { wsService } from "@/services/websocketService"
import { WebSocketEvent, OnlineStatusEvent, TypingEvent } from "@/models/websocket"

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("messages")
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { matches } = useAppSelector((state) => state.matches)
  const { typingUsers, onlineUsers, lastMessages } = useAppSelector((state) => state.websocket)
  const [onlineStatuses, setOnlineStatuses] = useState<{[key: string]: boolean}>({})
  const [typingStatuses, setTypingStatuses] = useState<{[key: string]: boolean}>({})


  // Séparer les matches avec et sans messages
  const matchesWithMessages = matches.filter((match) => match.lastMessage)
  const matchesWithoutMessages = matches.filter((match) => !match.lastMessage)

  useEffect(() => {
    const fetchMatches = async () => {
      await dispatch(getMatches())
    }
    fetchMatches()
  }, [dispatch])

  // Connexion WebSocket et gestion des événements
  useEffect(() => {
    if (user?._id) {

      const handleOnlineStatus = (data: WebSocketEvent) => {
        if (data.event === 'online_status') {
          const onlineStatusData = data as OnlineStatusEvent;
          const newStatuses: {[key: string]: boolean} = {};
          onlineStatusData.onlineStatuses.forEach(status => {
            newStatuses[status.userId] = status.isOnline;
          });
          setOnlineStatuses(newStatuses);
        }
      };

      const handleTyping = (data: WebSocketEvent) => {
        if (data.event === 'user_typing_display') {
          const typingData = data as TypingEvent;
          console.log('🔔 Typing event received:', typingData);
          if (typingData.sender_id !== user._id) {
            setTypingStatuses(prev => ({
              ...prev,
              [typingData.match_id]: true
            }));
            setTimeout(() => {
              setTypingStatuses(prev => ({
                ...prev,
                [typingData.match_id]: false
              }));
            }, 3000);
          }
        }
      };

      wsService.addEventListener('online_status', handleOnlineStatus);
      wsService.addEventListener('user_typing_display', handleTyping);

      // Demander les statuts en ligne au chargement
      setTimeout(() => {
        wsService.requestOnlineStatus();
      }, 1000);

      return () => {
        wsService.removeEventListener('online_status', handleOnlineStatus);
        wsService.removeEventListener('user_typing_display', handleTyping);
      };
    }
  }, [user?._id, matches]);

  return (
    <div className="w-80 flex flex-col h-screen border-r border-gray-200">
      {/* Header */}
      <div className="h-16 bg-[#FF385C] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            {user?.photos && user.photos[0] ? (
              <img
                src={user.photos[0]}
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
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "messages"
              ? "text-[#FF385C] border-b-2 border-[#FF385C]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === "matches"
              ? "text-[#FF385C] border-b-2 border-[#FF385C]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("matches")}
        >
          Matches
        </button>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "messages" ? (
          matchesWithMessages.map((match) => (
            <div
              key={match.match_id}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer relative"
              onClick={() => navigate(`/chat/${match.match_id}`)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  {match.user.photos && match.user.photos[0] ? (
                    <img
                      src={match.user.photos[0].photoUrl}
                      alt={`Photo de ${match.user.firstName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                {/* Indicateur de statut en ligne */}
                {onlineStatuses[match.user._id] && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {match.user.firstName}
                    </h3>
                    {onlineStatuses[match.user._id] ? (
                      <span className="text-xs text-green-500 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        En ligne
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Hors ligne
                      </span>
                    )}
                  </div>
                </div>
                {typingStatuses[match.match_id] ? (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-xs text-[#FF385C]">écrit...</span>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessages[match.match_id]?.content || match.lastMessage?.content || "Aucun message"}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          matchesWithoutMessages.map((match) => (
            <div
              key={match._id}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/chat/${match.match_id}`)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                  {match.user.photos && match.user.photos[0] ? (
                    <img
                      src={match.user.photos[0].photoUrl}
                      alt={`Photo de ${match.user.firstName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
                {/* Indicateur de statut en ligne */}
                {onlineUsers[match.user._id] && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{match.user.firstName}</h3>
                  {onlineUsers[match.user._id] ? (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      En ligne
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Hors ligne
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Nouveau match !</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

