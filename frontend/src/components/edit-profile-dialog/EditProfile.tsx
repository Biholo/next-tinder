import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { updateUser } from "@/redux/slices/userSlice"
import { Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface EditProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfile({ open, onOpenChange }: EditProfileProps) {
  const [activeTab, setActiveTab] = useState<"modifier" | "apercu">("modifier")
  const [smartPhotos, setSmartPhotos] = useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const [bio, setBio] = useState(user?.bio)
  const dispatch = useAppDispatch()

  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onOpenChange])

  const handleSave = () => {
    dispatch(updateUser({
      firstName: user?.firstName,
      lastName: user?.lastName,
      birthDate: user?.birthDate,
      bio: bio,
    }))
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 mx-auto">
      <div
        ref={dialogRef}
        className="bg-white w-full max-w-md h-[80vh] rounded-xl overflow-hidden flex flex-col"
      >
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("modifier")}
            className={`flex-1 py-4 px-6 text-sm font-medium ${
              activeTab === "modifier" ? "text-[#fd3a84] border-b-2 border-[#fd3a84]" : "text-gray-500"
            }`}
          >
            Modifier
          </button>
          <button
            onClick={() => setActiveTab("apercu")}
            className={`flex-1 py-4 px-6 text-sm font-medium ${
              activeTab === "apercu" ? "text-[#fd3a84] border-b-2 border-[#fd3a84]" : "text-gray-500"
            }`}
          >
            Aperçu
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {activeTab === "modifier" && (
            <div className="p-4 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">PHOTOS DE PROFIL</h2>
                <div className="grid grid-cols-3 gap-2">
                  {user?.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo || "/placeholder.svg"}

                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {}}
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 9 - user?.photos.length) }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-[#fd3a84] transition-colors"
                      onClick={() => {
                        // Logique pour ajouter une nouvelle photo
                        prompt("Entrez l'URL de la nouvelle photo:")
                      }}
                    >
                      <Plus className="w-8 h-8 text-[#fd3a84]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Smart Photos</h3>
                    <p className="text-sm text-gray-500">
                      Smart Photos examine toutes vos photos en permanence pour en sélectionner la meilleure et
                      l&apos;afficher en premier.
                    </p>
                  </div>
                  <button
                    onClick={() => setSmartPhotos(!smartPhotos)}
                    className={`w-14 h-6 rounded-full transition-colors relative ${
                      smartPhotos ? "bg-[#fd3a84]" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        smartPhotos ? "left-7" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">À PROPOS DE KILIAN</h2>
                <textarea
                  defaultValue={user?.bio}
                  className="w-full min-h-[100px] p-3 border rounded-lg focus:outline-none focus:border-[#fd3a84] resize-none"
                  onChange={(e) => setBio(e.target.value)}
                />
                <p className="text-right text-sm text-gray-500">{200 - bio?.length}</p>
                <p className="text-sm text-gray-500">

                  N&apos;incluez pas de pseudos de médias sociaux ou d&apos;autres informations de contact dans votre
                  profil.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Titre du poste</h2>
                <input type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#fd3a84] resize-none" />
              </div>

              <div className="space-y-4">
                <h2 className="text-lg font-semibold">FUN FACTS</h2>
                <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-between cursor-pointer hover:border-[#fd3a84] transition-colors">
                  <div>
                    <p className="font-medium">Choisir des Fun Facts sur moi</p>
                    <p className="text-sm text-gray-500">Répondre au Fun Fact</p>
                  </div>
                  <Plus className="w-6 h-6 text-[#fd3a84]" />
                </div>
              </div>

              <button className="w-full bg-[#fd3a84] text-white rounded-full py-3 font-medium hover:bg-[#fd3a84]/90 transition-colors" onClick={() => handleSave()}>
                Enregistrer
              </button>
            </div>
          )}

          {activeTab === "apercu" && (
            <div className="p-4 space-y-6">
              <h2 className="text-lg font-semibold">Aperçu de votre profil</h2>
              {/* Aperçu des photos */}
              <div className="grid grid-cols-3 gap-2">
                {user?.photos.map((photo: string, index: number) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={photo || "/placeholder.svg"}

                      alt={`Aperçu Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              {/* Ajouter d'autres aperçus de données si nécessaire */}
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

