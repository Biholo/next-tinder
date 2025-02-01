import { useState, useRef, useCallback, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import BottomSheet from "@gorhom/bottom-sheet"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getUsersToSwipe } from "@/redux/slices/userSlice"
import { createSwipe } from "@/redux/slices/swipeSlice"
import { wsService } from "@/services/websocketService"
import Swiper from 'react-native-deck-swiper'

const { width, height } = Dimensions.get("window")

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

type SwipeDirection = "DISLIKE" | "LIKE" | "up";

export default function HomeScreen() {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedUser, setMatchedUser] = useState<Profile | null>(null)
  
  const bottomSheetRef = useRef<BottomSheet>(null)
  const dispatch = useAppDispatch()
  const swiperRef = useRef(null)

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const renderPhoto = useCallback(({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={{ width, height: height * 0.6 }} resizeMode="cover" />
  ), [])

  // Charger les profils
  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await dispatch(getUsersToSwipe())
      if (response.payload && Array.isArray(response.payload)) {
        setProfiles(response.payload)
      }
    }
    fetchProfiles()

    // Écouter les nouveaux matches
    const handleNewMatch = (data: any) => {
      if (data.event === 'new_match') {
        setMatchedUser(data.user)
        setShowMatch(true)
        setTimeout(() => setShowMatch(false), 3000)
      }
    }

    wsService.addEventListener('new_match', handleNewMatch)
    return () => wsService.removeEventListener('new_match', handleNewMatch)
  }, [dispatch])

  // Gestionnaire de swipe amélioré
  const handleSwipeInternal = async (direction: SwipeDirection, index: number) => {
    const currentProfile = profiles[index]
    if (!currentProfile) return

    try {
      await dispatch(
        createSwipe({
          target_user_id: currentProfile._id,
          direction: direction === "LIKE" ? "LIKE" : "DISLIKE",
        })
      )
      
      wsService.sendSwipe(currentProfile._id, direction)
      setCurrentPhotoIndex(0)
    } catch (error) {
      console.error('Erreur lors du swipe:', error)
    }
  }

  const renderCard = (profile: Profile) => {
    if (!profile) return null

    return (
      <View className="h-[70vh] bg-white rounded-xl overflow-hidden">
        <FlatList
          data={profile.photos.map(photo => photo.photoUrl)}
          renderItem={renderPhoto}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
            setCurrentPhotoIndex(newIndex)
          }}
        />

        {/* Photo Progress Dots */}
        <View className="absolute top-4 w-full flex-row justify-center space-x-1">
          {profile.photos.map((_, index) => (
            <View
              key={index}
              className={`h-1 rounded-full ${index === currentPhotoIndex ? "w-6 bg-white" : "w-6 bg-white/50"}`}
            />
          ))}
        </View>

        {/* Gradient et infos */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.9)"]}
          className="absolute bottom-0 w-full p-4 pt-20"
        >
          <View className="mb-4">
            <View className="flex-row items-center">
              <Text className="text-white text-3xl font-bold mr-2">{profile.firstName}</Text>
              <Text className="text-white text-2xl">{profile.age}</Text>
            </View>

            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={16} color="white" />
              <Text className="text-white ml-1">{profile.location}</Text>
            </View>
          </View>

          {/* Intérêts */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            {interests.map((interest) => (
              <View key={interest} className="bg-zinc-800/80 rounded-full px-3 py-1">
                <Text className="text-white">{interest}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    )
  }

  const interests = ["Théâtre", "Voyage", "Expositions", "Jazz", "Musique"]

  const currentProfile = profiles[currentProfileIndex]

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        <Swiper
          ref={swiperRef}
          cards={profiles}
          renderCard={renderCard}
          onSwipedLeft={(index) => handleSwipeInternal("DISLIKE", index)}
          onSwipedRight={(index) => handleSwipeInternal("LIKE", index)}
          onSwipedTop={(index) => handleSwipeInternal("up", index)}
          cardIndex={currentProfileIndex}
          backgroundColor="transparent"
          stackSize={3}
          stackScale={10}
          stackSeparation={14}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: '#FF4458',
                  color: 'white',
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30
                }
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: '#4CD964',
                  color: 'white',
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30
                }
              }
            },
            top: {
              title: 'SUPER LIKE',
              style: {
                label: {
                  backgroundColor: '#00bfff',
                  color: 'white',
                  fontSize: 24
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }
              }
            }
          }}
        />

        {/* Boutons d'action - Ajout de positionnement absolu */}
        <View className="absolute bottom-0 left-0 right-0 pb-6 bg-transparent">
          <View className="flex-row justify-center items-center">
            <TouchableOpacity 
              className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center"
              onPress={() => swiperRef.current?.swipeLeft()}
            >
              <Ionicons name="close" size={30} color="#FF4458" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="mx-4 w-14 h-14 rounded-full bg-zinc-800 items-center justify-center"
              onPress={() => swiperRef.current?.swipeTop()}
            >
              <MaterialCommunityIcons name="star" size={30} color="#00bfff" />
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-14 h-14 rounded-full bg-zinc-800 items-center justify-center"
              onPress={() => swiperRef.current?.swipeRight()}
            >
              <Ionicons name="heart" size={24} color="#4CD964" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Sheet for Details */}
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["50%", "90%"]}
          backgroundStyle={{ backgroundColor: "#121212" }}
          handleIndicatorStyle={{ backgroundColor: "#ffffff" }}
        >
          <ScrollView className="p-4">
            {currentProfile ? (
              <>
                {/* Photos in BottomSheet */}
                <FlatList
                  data={currentProfile.photos.map((photo) => photo.photoUrl)}
                  renderItem={renderPhoto}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => {
                    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
                    setCurrentPhotoIndex(newIndex)
                  }}
                />

                {/* Photo Progress Dots */}
                <View className="w-full flex-row justify-center space-x-1 my-4">
                  {currentProfile.photos.map((_, index) => (
                    <View
                      key={index}
                      className={`h-1 rounded-full ${index === currentPhotoIndex ? "w-6 bg-white" : "w-6 bg-white/50"}`}
                    />
                  ))}
                </View>

                <View className="space-y-6">
                  <View>
                    <Text className="text-white text-xl font-bold mb-2">Je recherche</Text>
                    <View className="bg-zinc-800 rounded-lg p-4">
                      <View className="flex-row items-center">
                        <Text className="text-yellow-500 text-4xl mr-2">🤔</Text>
                        <Text className="text-white text-lg">
                          {currentProfile.preferences?.gender || "Je sais pas trop"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <Text className="text-white text-xl font-bold mb-2">L'essentiel</Text>
                    <View className="space-y-4">
                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="white" className="mr-2" />
                        <Text className="text-white">{currentProfile.location}</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons 
                          name={currentProfile.gender === 'female' ? "woman-outline" : "man-outline"} 
                          size={24} 
                          color="white" 
                          className="mr-2" 
                        />
                        <Text className="text-white">
                          {currentProfile.gender === 'female' ? 'Femme' : 'Homme'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-white">Chargement...</Text>
              </View>
            )}
          </ScrollView>
        </BottomSheet>
      </View>

      {/* Modal de Match */}
      {showMatch && matchedUser && currentProfile && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-2xl p-8 m-4">
            <View className="w-24 h-24 mx-auto mb-4 relative">
              <View className="absolute -left-4 top-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <Image 
                  source={{ uri: currentProfile.photos[0].photoUrl || "/placeholder.svg" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute -right-4 top-0 w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                <Image 
                  source={{ uri: matchedUser.photos[0].photoUrl || "/placeholder.svg" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute top-1/2 left-1/2 -translate-x-4 -translate-y-4">
                <Ionicons name="heart" size={32} color="#FF385C" />
              </View>
            </View>
            <Text className="text-2xl font-bold mb-4 text-[#FF385C] text-center">C'est un Match !</Text>
            <Text className="text-gray-600 mb-6 text-center">
              Vous et {matchedUser.firstName} vous êtes mutuellement appréciés !
            </Text>
            <TouchableOpacity 
              className="bg-[#FF385C] py-2 px-6 rounded-full"
              onPress={() => setShowMatch(false)}
            >
              <Text className="text-white text-center">Continuer à swiper</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

