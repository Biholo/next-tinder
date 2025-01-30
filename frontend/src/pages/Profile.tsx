import { EditProfile } from "@/components/edit-profile-dialog/EditProfile"
import { Briefcase, Check, GraduationCap, MessageCircle, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const images = [
  "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1523626752472-b55a628f1acc?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxfHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1523626752472-b55a628f1acc?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIxfHx8ZW58MHx8fHx8",
]

export default function Profile() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)

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
    <div className="flex flex-col items-center justify-center">
        <div className="relative min-h-screen w-full max-w-md mx-auto bg-white">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-20 bg-white p-4 border-b max-w-md mx-auto">
                <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Kilian 22</h1>
                <Check className="w-5 h-5 text-blue-500" />
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-20">
                {/* Image Carousel */}
                <div className="pt-16 relative">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {images.map((src, index) => (
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
                <div className="absolute top-4 left-0 right-0 flex justify-center gap-2 px-4">
                    {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 w-12 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? "bg-white" : "bg-white/30"
                        }`}
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
                    <p className="text-gray-600">Passionné par le cinéma (Inception meilleur film) Sombre passé sur League</p>
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
            <div className="fixed bottom-4 left-0 right-0 px-4 z-30 max-w-md mx-auto">
                <button className="w-full bg-[#fd3a84] text-white rounded-full py-3 px-6 flex items-center justify-between" onClick={() => setEditDialogOpen(!editDialogOpen)}>
                <span>Modifier vos informations</span>
                <span className="text-sm">(Complété à 74 %)</span>
                </button>
            </div>
        </div>
        <EditProfile open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </div>
  )
}

