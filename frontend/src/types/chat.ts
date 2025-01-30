export interface User {
  id: string
  name: string
  avatar?: string
  age?: number
  location?: string
  languages?: string[]
  bio?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
  type: 'text' | 'image'
}

export interface Match {
  id: string
  users: string[]
  matchedAt: Date
  lastMessage?: Message
  otherUser?: User
} 