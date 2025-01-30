import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-orange-400 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Créer un compte</h1>

        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nom"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
           <Input
            type="text"
            placeholder="Prénom"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="tel"
            placeholder="Numéro de téléphone"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="date"
            placeholder="Date de naissance"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <select className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white">
            <option value="" disabled selected>
              Genre
            </option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="non-binaire">Non-binaire</option>
            <option value="autre">Autre</option>
          </select>
          <select className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white">
            <option value="" disabled selected>
              Intéressé(e) par
            </option>
            <option value="hommes">Hommes</option>
            <option value="femmes">Femmes</option>
            <option value="tous">Tous</option>
          </select>
        </div>

        <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 rounded-full hover:from-pink-600 hover:to-orange-500 transition duration-300">
          Créer un compte
        </Button>

        <p className="text-center text-sm text-gray-600">
          En créant un compte, vous acceptez nos{" "}
          <a href="#" className="text-pink-500 hover:underline">
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-pink-500 hover:underline">
            Politique de confidentialité
          </a>
          .
        </p>
      </div>
    </div>
  )
}

