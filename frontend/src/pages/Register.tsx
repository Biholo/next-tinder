import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { register } from "@/redux/slices/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "@/validators/registerValidator";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

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
  const [errors, setErrors] = useState<any>({}); 
  const errorMessage = useSelector((state: RootState) => state.auth.error);
  const [connectionError, setConnectionError] = useState<string | null>(null) 
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (errorMessage && errorMessage !== "te") {
      setConnectionError(errorMessage)
    } else {
      setConnectionError(null)
    }
  }, [errorMessage])

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
  
      const { error } = await registerSchema.validate({ ...formData, confirmPassword }, { abortEarly: false });
  
      if (error) {
        const formattedErrors: any = {};
        error.details.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors); 
        return;
      }
  
      const response = await dispatch(register(formData));
      console.log('response', response);
      if (response?.tokens.accessToken) {
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
            <div className="w-full">
              <Input
                type="text"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
            </div>
            <div className="w-full">
              <Input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
            </div>
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Input
              type="tel"
              name="phone"
              placeholder="Numéro de téléphone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <Input
              type="date"
              name="dateOfBirth"
              placeholder="Date de naissance"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
          </div>
          <div className="flex gap-2">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-1 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-white"
            >
              <option value="" disabled>
                Genre
              </option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
        </div>
        {connectionError && (<p className="text-red-500 text-sm mt-1">{connectionError}</p>)}
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

