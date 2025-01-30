import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img src="/logo_tinder.png" alt="Tinder Logo" width={100} height={100} className="rounded-full" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Connexion</h1>
        <form className="space-y-4">
          <Input type="text" placeholder="Numéro de téléphone" className="w-full px-4 py-2 border rounded-full" />
          <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 rounded-full hover:from-pink-600 hover:to-orange-600 transition duration-300">
            Continuer
          </Button>
        </form>
        <p className="mt-6 text-xs text-center text-gray-600">
          En vous connectant, vous acceptez nos{" "}
          <a href="https://policies.tinder.com/terms/intl/fr/?lang=fr" className="text-pink-500 hover:underline">
            Conditions
          </a>
          . Découvrez comment nous traitons vos données dans notre{" "}
          <a href="https://policies.tinder.com/privacy/intl/fr/?lang=fr" className="text-pink-500 hover:underline">
            Politique de confidentialité
          </a>{" "}
          et notre{" "}
          <a href="https://policies.tinder.com/cookie-policy/intl/fr/?lang=fr" className="text-pink-500 hover:underline">
            Politique en matière de cookies
          </a>
          .
        </p>
      </div>
    </div>
  )
}

