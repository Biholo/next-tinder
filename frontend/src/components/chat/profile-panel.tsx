import type { User } from "@/models/chat"
import { MapPin } from "lucide-react"

interface ProfilePanelProps {
  user: User
}

export function ProfilePanel({ user }: ProfilePanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={`Photo de ${user.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">
            {user.name} {user.age && `• ${user.age}`}
          </h2>
        </div>
        <div className="space-y-4">
          {user.location && (
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
          {user.languages && user.languages.length > 0 && (
            <div className="space-y-1">
              <span className="font-medium">Langues</span>
              <div className="text-gray-500">
                {user.languages.join(", ")}
              </div>
            </div>
          )}
          {user.bio && (
            <div className="space-y-1">
              <span className="font-medium">À propos</span>
              <p className="text-gray-500">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 