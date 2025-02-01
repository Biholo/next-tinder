"use client"

import { useEffect, useRef, useState } from "react"
import TinderCard from "react-tinder-card"
import { Heart, Star, X, ChevronDown, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { getUsersToSwipe } from "@/redux/slices/userSlice"
import { createSwipe } from "@/redux/slices/swipeSlice"
import { wsService } from "@/services/websocketService"
import { motion, AnimatePresence } from "framer-motion"

interface Profile {
  _id: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  location: string
  bio: string
  preferences: {
    gender: string
    ageRange: {
      min: number
      max: number
    }
  }
  photos: {
    _id: string
    photoUrl: string
  }[]
  age: number
}

type Direction = 'left' | 'right' | 'up' | 'down';
type SwipeDirection = "DISLIKE" | "LIKE" | "up";

interface MatchEvent {
  event: 'new_match'
  user: Profile
}

interface TinderCardRef {
  swipe: (dir: Direction) => void;
}

export default function SwipeCards() {
  const [profileIndex, setProfileIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [showMatch, setShowMatch] = useState(false)
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null)

  const dispatch = useAppDispatch()

  const currentProfiles = profiles.slice(profileIndex)

  const cardRefs = useRef<(TinderCardRef | null)[]>([])

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await dispatch(getUsersToSwipe())
      if (response.payload && Array.isArray(response.payload)) {
        setProfiles(response.payload)
      }
    }
    fetchProfiles()
  }, [dispatch])

  useEffect(() => {
    cardRefs.current = new Array(currentProfiles.length).fill(null)
  }, [currentProfiles.length])

  useEffect(() => {
    dispatch(getUsersToSwipe())

    // Écouter les nouveaux matches
    const handleNewMatch = (data: MatchEvent) => {
      if (data.event === 'new_match') {
        setMatchedUser(data.user)
        setShowMatch(true)
        // Cacher la modale après 3 secondes
        setTimeout(() => setShowMatch(false), 3000)
      }
    }

    wsService.addEventListener('new_match', handleNewMatch as any)
    return () => wsService.removeEventListener('new_match', handleNewMatch as any)
  }, [dispatch])

  const handleSwipe = async (direction: SwipeDirection) => {
    
    if (profileIndex < profiles.length) {
      console.log(profiles[profileIndex]._id);
      await dispatch(
        createSwipe({
          target_user_id: profiles[profileIndex]._id,
          direction: direction === "LIKE" ? "LIKE" : "DISLIKE",
        })
        
      )
      wsService.sendSwipe(profiles[profileIndex]._id, direction)
      setProfileIndex((prev) => prev + 1)
    }
  }

  const onSwipe = (direction: Direction) => {
    const directionMap: Record<Direction, SwipeDirection> = {
      left: "DISLIKE",
      right: "LIKE",
      up: "up",
      down: "DISLIKE"
    };
    handleSwipe(directionMap[direction]);
    setProfileIndex((prev: number) => prev + 1);
    setImageIndex(0);
    setIsContentVisible(false);
  };

  const onCardLeftScreen = (name: string) => {
    console.log(`${name} a quitté l'écran`)
  }

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible)
  }

  const nextImage = () => {
    const currentProfile = profiles[profileIndex];
    if (!currentProfile?.photos?.length) return;
    
    if (currentProfile.photos.length === 1) {
      setImageIndex(0);
    } else {
      setImageIndex((prev: number) => (prev + 1) % currentProfile.photos.length);
    }
  };

  const prevImage = () => {
    const currentProfile = profiles[profileIndex];
    if (!currentProfile?.photos?.length) return;
    
    if (currentProfile.photos.length === 1) {
      setImageIndex(0);
    } else {
      setImageIndex((prev: number) => (prev - 1 + currentProfile.photos.length) % currentProfile.photos.length);
    }
  };



  const currentUser = profiles[profileIndex]

  if (profiles.length === 0) {
    return <div className="flex items-center justify-center h-screen text-center">Aucun profil disponible</div>
  }

  // Vérifier si le profil courant existe et a des photos
  if (!currentUser?.photos?.length) {
    return <div className="flex items-center justify-center h-screen">Aucune photo disponible</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 w-full">
      <div className="flex-grow flex flex-col overflow-hidden">
        <div className="relative flex-grow flex justify-center items-center">
          {currentProfiles.slice(0, 1).map((profile: Profile, index: number) => (
            <TinderCard
              key={profile._id}
              ref={(el: TinderCardRef | null) => (cardRefs.current[0] = el)}
              onSwipe={(dir: Direction) => onSwipe(dir)}
              onCardLeftScreen={() => onCardLeftScreen(profile.firstName)}
              flickOnSwipe={true}
              preventSwipe={["down"]}
              className="absolute w-[90%] max-w-md h-[70vh]"
            >
              <div className="relative w-full h-full bg-white rounded-xl shadow-xl overflow-hidden">
                {profile.photos && profile.photos.length > 0 && (
                  <img
                    src={profile.photos[imageIndex]?.photoUrl || "/placeholder.svg"}
                    alt={profile.firstName}
                    className="object-cover w-full h-full"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-20 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {profile.firstName} <span className="text-xl font-normal">{profile.age}</span>
                  </h2>
                </div>
                <div className="absolute bottom-4 right-16 bg-black/50 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>
                    {imageIndex + 1}/{profile.photos.length}
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
          className={`flex-shrink-0 bg-white w-full max-w-md mx-auto transition-all duration-300 ease-in-out overflow-hidden ${
            isContentVisible ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📍</span>
              <span>{profiles[profileIndex]?.location}</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Bio</h2>
              <p>{profiles[profileIndex]?.bio}</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-medium">Préférences</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Genre : {profiles[profileIndex]?.preferences.gender}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Age : {profiles[profileIndex]?.preferences.ageRange.min} -{" "}
                  {profiles[profileIndex]?.preferences.ageRange.max} ans
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white shadow-md">
        <div className="flex justify-center gap-2 p-4">
          {["DISLIKE", "up", "LIKE"].map((direction) => (
            <Button
              key={direction}
              size="icon"
              variant="outline"
              className={`h-12 w-12 rounded-full border-2 bg-white hover:bg-gray-100 transition-colors ${
                direction === "DISLIKE"
                  ? "border-rose-500 text-rose-500 hover:bg-rose-50"
                  : direction === "LIKE"
                    ? "border-green-500 text-green-500 hover:bg-green-50"
                    : "border-blue-500 text-blue-500 hover:bg-blue-50"
              }`}
              onClick={() => handleSwipe(direction as SwipeDirection)}
            >
              {direction === "DISLIKE" && <X className="h-6 w-6" />}
              {direction === "up" && <Star className="h-6 w-6" />}
              {direction === "LIKE" && <Heart className="h-6 w-6" />}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-500"
          >
            <X className="h-4 w-4" />
            DISLIKE
            <kbd className="ml-1 px-1 py-0.5 text-[10px] font-mono bg-gray-100 rounded">←</kbd>
          </Button>
          <Button
            variant="ghost"
            className="text-xs flex items-center gap-1 bg-white hover:bg-green-50 text-green-500"
          >
            <Heart className="h-4 w-4" />
            LIKE
            <kbd className="ml-1 px-1 py-0.5 text-[10px] font-mono bg-gray-100 rounded">→</kbd>
          </Button>
          <Button
            size="sm"
            className="text-xs flex items-center gap-1 bg-white hover:bg-blue-50 text-blue-500"
          >
            <Star className="h-4 w-4" />
            Superlike
            <kbd className="ml-1 px-1 py-0.5 text-[10px] font-mono bg-gray-100 rounded">↑</kbd>
          </Button>
        </div>
      </div>

      {/* Modale de match */}
      <AnimatePresence>
        {showMatch && matchedUser && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <div className="absolute -left-4 top-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                  <img 
                    src={currentUser?.photos[0]?.photoUrl || "/placeholder.svg"} 
                    alt="Votre photo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -right-4 top-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                  <img 
                    src={matchedUser.photos[0]?.photoUrl || "/placeholder.svg"} 
                    alt={`Photo de ${matchedUser.firstName}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Heart className="w-8 h-8 text-[#FF385C] fill-[#FF385C]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-[#FF385C]">C'est un Match !</h2>
              <p className="text-gray-600 mb-6">
                Vous et {matchedUser.firstName} vous êtes mutuellement appréciés !
              </p>
              <button 
                className="px-6 py-2 bg-[#FF385C] text-white rounded-full hover:bg-[#FF385C]/90 transition"
                onClick={() => setShowMatch(false)}
              >
                Continuer à swiper
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

