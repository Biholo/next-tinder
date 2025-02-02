"use client";

import { useState, useEffect } from "react";
import { Users, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { getMatches } from "@/redux/slices/matcheSlice";
import { fetchConversations } from "@/redux/slices/conversationSlice";

interface Match {
  _id: string;
  match_id: string;
  user: {
    _id: string;
    firstName: string;
    photos: Array<{ photoUrl: string }>;
  };
}

interface Conversation {
  matchId: string;
  user: {
    id: string;
    firstName: string;
    avatar: string;
  };
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: string;
  } | null;
}

interface OnlineUser {
  userId: string;
  isOnline: boolean;
}

export function AppSidebar() {
  const [activeTab, setActiveTab] = useState("messages");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  const { matches } = useAppSelector((state) => state.matches);
  const { conversations } = useAppSelector((state) => state.conversations);
  const { typingUsers, onlineUsers } = useAppSelector((state) => state.websocket);

  useEffect(() => {
    console.log(onlineUsers)
  }, [onlineUsers])

  // Charger les données au montage
  useEffect(() => {
    dispatch(getMatches());
    dispatch(fetchConversations());
  }, [dispatch]);

  // Séparer les matchs sans messages
  const matchesWithoutMessages = matches.filter(
    (match: Match) => !conversations.some((conv: Conversation) => conv.matchId === match.id)
  );

  useEffect(() => {
    console.log('🔹 matchesWithoutMessages')
    console.log(matchesWithoutMessages)
    console.log(conversations)
  }, [matchesWithoutMessages])

  return (
    <div className="w-80 flex flex-col h-screen border-r border-gray-200">
      
      {/* 🔹 Header */}
      <div className="h-16 bg-[#FF385C] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/profile")}>
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            {user?.photos?.[0]?.photoUrl ? (
              <img src={user.photos[0].photoUrl} alt={`Photo de ${user.firstName}`} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <span className="font-medium text-white">{user?.firstName || "Utilisateur"}</span>
        </div>
        <button className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30" onClick={() => navigate("/")}>
          <Users className="h-5 w-5" />
        </button>
      </div>

      {/* 🔹 Onglets Messages / Matchs */}
      <div className="flex border-b border-gray-200">
        {["messages", "matches"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === tab ? "text-[#FF385C] border-b-2 border-[#FF385C]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "messages" ? "Messages" : "Matches"}
          </button>
        ))}
      </div>

      {/* 🔹 Utilisateurs en ligne */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase">En ligne</h3>
        <div className="flex gap-2 mt-2">
          {conversations.map((conv: any) => {
            console.log('🔍 conv:', conv)
            console.log('🔍 onlineUsers:', onlineUsers)
            const isOnline = onlineUsers[conv.user.id] === true;
            if (!isOnline) return null;
            
            return (
              <div key={conv.user.id} className="relative w-10 h-10">
                <img
                  src={conv.user.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
            );
          })}
          {!Object.values(onlineUsers).some(status => status === true) && (
            <p className="text-sm text-gray-400">Aucun utilisateur en ligne</p>
          )}
        </div>
      </div>

      {/* 🔹 Liste des Conversations ou Matchs */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "messages" ? (
          conversations.map((conv: any) => (
            <div
              key={conv.matchId}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer relative"
              onClick={() => navigate(`/chat/${conv.match_id}`)}
            >
              <div className="relative">
                <img src={conv.user.photos[0].photoUrl} alt="Photo" className="w-12 h-12 rounded-full object-cover" />
                {onlineUsers[conv.user.id] === true && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{conv.user.firstName}</h3>
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </div>
                {typingUsers[conv.match_id] ? (
                  <span className="text-xs text-[#FF385C]">En train d'écrire...</span>
                ) : (
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content || "Aucun message"}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          matchesWithoutMessages.map((match: any) => (
            <div
              key={match._id}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/chat/${match.id}`)}
            >
              <div className="relative">
                <img src={match.avatar} alt="Photo" className="w-12 h-12 rounded-full object-cover" />
                {onlineUsers[match.userId] === true && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{match.name}</h3>
                <p className="text-sm text-gray-500">Nouveau match !</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
