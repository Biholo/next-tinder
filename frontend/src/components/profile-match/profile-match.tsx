import { Heart, Search, MapPin, Ruler, GraduationCap, HomeIcon, Clock, Wine, Cigarette } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileProps {
  user: {
    name: string
    age: number
    image: string
    bio: string
    distance: string
    height: string
    education: string
    location: string
    zodiacSign: string
    pets: string
    alcohol: string
    smoking: string
  }
}

export function Profile({ user }: ProfileProps) {
  return (
    <div className="w-[400px] overflow-y-auto">
      <div className="relative h-[500px]">
        <img src={user.image || "/placeholder.svg"} alt={user.name} className="object-cover" />
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            {user.name} {user.age}
          </h2>
          <Button variant="ghost" size="icon">
            <Heart className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-pink-500" />
            <span className="font-medium">Une relation sérieuse</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Bio Tinder</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">L'essentiel</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{user.distance}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Ruler className="h-5 w-5" />
                <span>{user.height}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <GraduationCap className="h-5 w-5" />
                <span>{user.education}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <HomeIcon className="h-5 w-5" />
                <span>Vit ici : {user.location}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Mode de vie</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{user.zodiacSign}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <img src="/placeholder.svg" alt="Pet" width={20} height={20} />
                <span>{user.pets}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Wine className="h-5 w-5" />
                <span>{user.alcohol}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Cigarette className="h-5 w-5" />
                <span>{user.smoking}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

