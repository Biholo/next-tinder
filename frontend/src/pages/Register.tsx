import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { register } from "@/redux/slices/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "male",
    // preferences: {
    //   gender: "both",
    //   ageRange: {
    //     min: 18,
    //     max: 100
    //   }
    // }
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setFormData({
  //     ...formData,
  //     preferences: {
  //       ...formData.preferences,
  //       [e.target.name]: e.target.value,
  //     },
  //   });
  // };

  const handleRegister = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const response = await dispatch(register(formData));
      console.log('response', response);
        if(response?.tokens.accessToken) {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="fixed w-full min-h-screen bg-gradient-to-br from-pink-500 to-orange-400 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Créer un compte</h1>

        <div className="space-y-4">
          <div className="flex gap-2">
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
          </div>
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
            type="date"
            name="dateOfBirth"
            placeholder="Date de naissance"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <div className="flex gap-2">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-1 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white"
          >
            <option value="male" disabled>
              Genre
            </option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
          {/* <select
            name="preferences"
            value={formData.preferences.gender}
            onChange={handlePreferencesChange}
            className="w-full px-4 py-1 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white"
          >
            <option value="both" disabled>
              Intéressé(e) par
            </option>
            <option value="male">Hommes</option>
            <option value="female">Femmes</option>
            <option value="both">Tous</option>
          </select> */}
          </div>
          <Input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        <Button
          onClick={handleRegister}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 rounded-full hover:from-pink-600 hover:to-orange-500 transition duration-300"
        >
          Créer un compte
        </Button>
        <p 
        onClick={() => navigate("/login")}
        className="cursor-pointer text-center text-sm text-gray-600">
          Vous avez déjà un compte ?
        </p>

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

