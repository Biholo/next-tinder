import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { login } from "@/redux/slices/authSlice"
import { loginSchema } from "@/validators/loginValidator" 

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogin = () => {
    const validation = loginSchema.validate({ email, password }, { abortEarly: false })

    if (validation.error) {
      const formattedErrors: { email?: string; password?: string } = {}
      validation.error.details.forEach((err) => {
        if (err.path.includes("email")) formattedErrors.email = err.message
        if (err.path.includes("password")) formattedErrors.password = err.message
      })
      setErrors(formattedErrors)
      return
    }

    setErrors({})
    dispatch(login({ email, password }))
    navigate("/")
  }

  return (
    <div className="fixed w-full h-screen bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img src="/logo_tinder.png" alt="Tinder Logo" width={100} height={100} className="rounded-full" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Connexion</h1>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Input 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-2 border rounded-full" 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>} {/* Erreur email */}
          </div>
          <div>
            <Input 
              type="password" 
              placeholder="Mot de passe" 
              className="w-full px-4 py-2 border rounded-full" 
              onChange={(e) => setPassword(e.target.value)} 
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>} {/* Erreur mot de passe */}
          </div>
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 rounded-full hover:from-pink-600 hover:to-orange-600 transition duration-300"
          >
            Continuer
          </Button>
          <p 
            onClick={() => navigate("/register")}
            className="cursor-pointer text-center text-gray-500"
          >
            Créer un compte
          </p>
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
