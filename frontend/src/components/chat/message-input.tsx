import { useState } from "react"
import { ImageIcon, Smile } from "lucide-react"

interface MessageInputProps {
  onSendMessage: (content: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <button 
          type="button" 
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <Smile className="h-5 w-5" />
        </button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:border-[#FF1B5B]"
          placeholder="Rédigez un message"
        />
      </div>
    </form>
  )
} 