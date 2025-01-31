import { EditProfile } from "@/components/edit-profile-dialog/EditProfile"
import { Briefcase, Check, GraduationCap, MessageCircle, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useDispatch } from "react-redux"
import { updateUser } from "@/redux/slices/authSlice"

interface Photo {
  _id: string
  photoUrl: string
  userId: string
}

interface User {
  _id: string
  firstName: string
  dateOfBirth: string
  photos: Photo[]
  bio?: string
  preferences: {
    gender: 'male' | 'female' | 'all'
    ageRange: {
      min: number
      max: number
    }
  }
}

export default function Profile() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()
    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const userData = await response.json()
                dispatch(updateUser(userData))
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur:', error)
            }
        }

        fetchUserData()
    }, [dispatch])

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft
      const imageWidth = carouselRef.current.offsetWidth
      const newIndex = Math.round(scrollPosition / imageWidth)
      setCurrentImageIndex(newIndex)
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll)
      return () => carousel.removeEventListener("scroll", handleScroll)
    }
  }, [carouselRef.current])

  return (
    <div className="flex flex-col items-center justify-center m-auto">
        <div className="relative min-h-screen w-full max-w-md mx-auto bg-white">
            {/* Fixed Header */}
            <header className="fixed w-full z-20 bg-white p-4 border-b max-w-md mx-auto">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-semibold">
                      {user?.firstName} {user?.dateOfBirth && Math.floor((new Date() - new Date(user.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))}
                    </h1>
                <Check className="w-5 h-5 text-blue-500" />
                </div>
            </header>


            {/* Main Content */}
            <main className="pb-20 mx-auto">
                {/* Image Carousel */}
                <div className="pt-16 relative">
                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
                            style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
                        >
                            {user?.photos.map((src: string, index: number) => (
                                <div key={index} className="flex-shrink-0 w-full h-[600px] snap-center relative overflow-hidden">
                                    <img
                                        src={src || "/placeholder.svg"}
                                        alt={`Photo de profil ${index + 1}`}
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                    {/* Indicateurs de progression */}
                    <div className="absolute top-12 left-0 right-0 flex justify-center gap-2 px-4">
                        {user?.photos.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 w-12 rounded-full transition-colors duration-200 z-[9999]`}
                            style={{
                                backgroundColor: index === currentImageIndex ? "rgb(253 58 132)" : "rgb(252, 151, 190)"
                            }}
                        />
                        ))}
                    </div>
                </div>


                {/* Scrollable Content */}
                <div className="relative z-10 -mt-20 rounded-t-3xl bg-white shadow-lg">
                    <div className="px-4 py-6 space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Je recherche"
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        {/* Relationship Intent */}
                        <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                            <span className="text-xl">😊</span>
                            <span className="font-medium">Long terme, OK pour court</span>
                        </div>

                        {/* Bio Section */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Bio Tinder</h2>
                            <p className="text-gray-600">{user?.bio}</p>
                        </div>

                        {/* Essential Info */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">L&apos;essentiel</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-gray-500" />
                                    <span>Developeur</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="w-5 h-5 text-gray-500" />
                                    <span>Université Gustave Eiffel</span>
                                </div>
                            </div>
                        </div>

                        {/* Préférences */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Préférences</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">Genre préféré :</span>
                                    <span className="text-gray-600 capitalize">{user?.preferences.gender  === 'male' ? 'Homme' : user?.preferences.gender === 'female' ? 'Femme' : 'Tout'}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">Tranche d'âge :</span>
                                    <span className="text-gray-600">
                                        {user?.preferences.ageRange.min} - {user?.preferences.ageRange.max} ans
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* More Info Section */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-medium">Plus d&apos;infos sur moi</h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="w-5 h-5 text-gray-500" />
                                    <span>Texto</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Fixed Edit Button */}
            <div className="fixed bottom-4 w-full px-4 z-30 max-w-md mx-auto">
                <button className="w-full bg-[#fd3a84] text-white rounded-full py-3 px-6 flex items-center justify-between" onClick={() => setEditDialogOpen(!editDialogOpen)}>
                    <span>Modifier vos informations</span>
                    <span className="text-sm">(Complété à 74 %)</span>
                </button>
            </div>
            <EditProfile open={editDialogOpen} onOpenChange={setEditDialogOpen} />
        </div>
    </div>
  )
}

