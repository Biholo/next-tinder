import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { register } from "@/redux/slices/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    preferences: ""
  });

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e:React.FormEvent) => {
    try {
        e.preventDefault();
        dispatch(register(formData));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-orange-400 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Créer un compte</h1>

        <div className="space-y-4">
          <Input
            type="text"
            name="firstName"
            placeholder="Nom"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="text"
            name="lastName"
            placeholder="Prénom"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="tel"
            name="phone"
            placeholder="Numéro de téléphone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="date"
            name="dateOfBirth"
            placeholder="Date de naissance"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white"
          >
            <option value="" disabled>
              Genre
            </option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
          <select
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white"
          >
            <option value="" disabled>
              Intéressé(e) par
            </option>
            <option value="hommes">Hommes</option>
            <option value="femmes">Femmes</option>
            <option value="tous">Tous</option>
          </select>
        </div>

        <Button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 rounded-full hover:from-pink-600 hover:to-orange-500 transition duration-300"
        >
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
  );
}

