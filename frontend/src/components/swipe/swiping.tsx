"use client"

import { useEffect, useRef, useState } from "react"
import TinderCard from "react-tinder-card"
import { Heart, Star, X, ChevronDown, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Profile {
  id: number
  name: string
  age: number
  imgs: string[]
  bio: string
  mood: string
  preferences: string[]
}

const profiles: Profile[] = [
  {
    id: 1,
    name: "Alice",
    age: 28,
    imgs: [
      "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    bio: "Aventurière passionnée, toujours prête pour de nouvelles expériences !",
    mood: "Je sais pas trop",
    preferences: ["La monogamie", "Les voyages", "La cuisine"],
  },
  {
    id: 2,
    name: "Bob",
    age: 32,
    imgs: [
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    bio: "Amoureux des animaux et de la nature. Cherche une âme sœur pour partager mes passions.",
    mood: "Ouvert à tout",
    preferences: ["Les animaux", "Le plein air", "La photographie"],
  },
  {
    id: 3,
    name: "Charlie",
    age: 25,
    imgs: [
      "https://images.unsplash.com/photo-1523626752472-b55a628f1acc?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxfHx8ZW58MHx8fHx8",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ],
    bio: "Artiste dans l'âme, je cherche quelqu'un pour partager ma créativité et mon amour pour l'art.",
    mood: "Créatif et inspiré",
    preferences: ["L'art", "La musique", "Les expositions"],
  },
]

type Direction = "left" | "right" | "up"

export default function ProfileCard() {
  const [lastDirection, setLastDirection] = useState<Direction | null>(null)
  const [profileIndex, setProfileIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(false)
  
  const currentProfiles = profiles.slice(profileIndex)
  
  type TinderCardRef = {
    swipe: (dir: Direction) => void
  }
  const cardRefs = useRef<(TinderCardRef | null)[]>([])

  useEffect(() => {
    cardRefs.current = new Array(currentProfiles.length).fill(null)
  }, [currentProfiles.length, profileIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (profileIndex >= profiles.length) return

      switch (event.key) {
        case "ArrowLeft":
          swipe("left")
          break
        case "ArrowRight":
          swipe("right")
          break
        case "ArrowUp":
          swipe("up")
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [profileIndex, currentProfiles.length])

  const swipe = (direction: Direction) => {
    if (profileIndex >= profiles.length) return

    const topCardIndex = currentProfiles.length - 1
    const currentCard = cardRefs.current[topCardIndex]
    
    if (currentCard) {
      currentCard.swipe(direction)
    }
  }

  const onSwipe = (direction: Direction, name: string) => {
    console.log(`${name} a été swipé ${direction}`)
    setLastDirection(direction)
    setProfileIndex((prev) => prev + 1)
    setImageIndex(0)
    setIsContentVisible(false)
  }

  const onCardLeftScreen = (name: string) => {
    console.log(`${name} a quitté l'écran`)
  }

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible)
  }

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % profiles[profileIndex].imgs.length)
  }

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + profiles[profileIndex].imgs.length) % profiles[profileIndex].imgs.length)
  }

  return (
    <div
      className={`w-full h-screen flex flex-col overflow-hidden bg-gray-100 transition-all duration-300 ${isContentVisible ? "h-[calc(100vh+220px)]" : ""}`}
    >
      <div className="flex-1 overflow-hidden relative">
        <div className="relative h-[calc(100vh-100px)]">
          {currentProfiles.map((profile, index) => (
            <TinderCard
              key={profile.id}
              ref={(el) => (cardRefs.current[index] = el)}
              onSwipe={(dir) => onSwipe(dir as Direction, profile.name)}
              onCardLeftScreen={() => onCardLeftScreen(profile.name)}
              preventSwipe={["down"]}
              className={`absolute w-[45vw] h-[calc(100vh-120px)] left-[27.5vw] top-[20px]`}
              style={{
                zIndex: currentProfiles.length - index
              }}
            >
              <div className="relative w-full h-full bg-white rounded-xl shadow-xl overflow-hidden">
                <img
                  src={profile.imgs[imageIndex] || "/placeholder.svg"}
                  alt={profile.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-20 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {profile.name} <span className="text-xl font-normal">{profile.age}</span>
                  </h2>
                </div>
                <div className="absolute bottom-4 right-16 bg-black/50 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>
                    {imageIndex + 1}/{profile.imgs.length}
                  </span>
                </div>
                <button
                  onClick={toggleContent}
                  className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2 shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronDown
                    className={`h-6 w-6 transform transition-transform ${isContentVisible ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/80 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-black/70" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/80 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-black/70" />
                </button>
              </div>
            </TinderCard>
          ))}
        </div>

        <div
          className={`absolute left-[27.5vw] w-[45vw] bg-white p-4 pb-20 space-y-4 transition-all duration-300 ease-in-out ${
            isContentVisible ? "bottom-0 opacity-100" : "-bottom-[220px] opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">🤔</span>
            <span>{profiles[profileIndex]?.mood}</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium">Bio</h2>
            <p>{profiles[profileIndex]?.bio}</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-medium">Préférences</h2>
            <div className="flex flex-wrap gap-2">
              {profiles[profileIndex]?.preferences.map((pref, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {pref}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full">
        <div className="flex justify-center gap-2 p-4">
          {["left", "up", "right"].map((direction) => (
            <Button
              key={direction}
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full border-2 bg-white/80 backdrop-blur-sm"
              onClick={() => swipe(direction as Direction)}
            >
              {direction === "left" && <X className="h-6 w-6 text-rose-500" />}
              {direction === "up" && <Star className="h-6 w-6 text-blue-500" />}
              {direction === "right" && <Heart className="h-6 w-6 text-green-500" />}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 px-4 py-2">
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 bg-white/80 backdrop-blur-sm">
            <X className="h-4 w-4" />
            Non
            <kbd className="ml-1 px-1 py-0.5 text-[10px] font-mono bg-gray-100 rounded">←</kbd>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 bg-white/80 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
            Like
            <kbd className="ml-1 px-1 py-0.5 text-[10px] font-mono bg-gray-100 rounded">→</kbd>
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 bg-white/80 backdrop-blur-sm">
            <Star className="h-4 w-4" />
            Superlike
            <kbd className="ml-1 px-1 py-0.5 text-[10px] font-mono bg-gray-100 rounded">↑</kbd>
          </Button>
        </div>
      </div>
    </div>
  )
}

