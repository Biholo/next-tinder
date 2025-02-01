import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Header } from "@/components"

export default function NotFoundScreen() {
    const router = useRouter()

    return (
        <SafeAreaView style={styles.container}>
            <Header
                logoUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mJXBl7iepu0PcsBCV3p2hq90HAMcku.png"
                showSettingsButton
            />
            <View style={styles.content}>
                <Text style={styles.title}>404</Text>
                <Text style={styles.message}>Oops! Cette page n'existe pas.</Text>
                <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
                    <Text style={styles.buttonText}>Retour à l'accueil</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 72,
        fontWeight: "bold",
        color: "#FF4458",
        marginBottom: 20,
    },
    message: {
        fontSize: 18,
        color: "#fff",
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#FF4458",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
})

