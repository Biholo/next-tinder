import { Request, Response } from "express";
import UserPhotoModel from "@/models/userPhotoModel";
import UserModel, { IUser } from "@/models/userModel";
;

// Vérifier que les variables sont bien définies
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "1h";

interface CustomRequest extends Request {
  user?: { id: string };
}

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Register a new user.
 * @param req.body.firstName - The user's first name.
 * @param req.body.lastName - The user's last name.
 * @param req.body.email - The user's email address.
 * @param req.body.password - The user's password.
 * @param req.body.roles - Optional roles of the user (defaults to ["client"]).
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, phone, dateOfBirth, gender, roles } = req.body;
  
  if (!firstName || !lastName || !email || !password || !phone || !dateOfBirth || !gender) {
    res.status(400).json({ message: "Tous les champs sont requis." });
    return;
  }

  try {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Cet email est déjà utilisé." });
      return;
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier et définir les rôles
    const userRoles = Array.isArray(roles) ? roles : ["ROLE_CLIENT"];

    // Créer un nouvel utilisateur
    const newUser: IUser = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles: userRoles,
      phone,
      dateOfBirth,
      gender,
      // preferences: preferences
    });



    // Générer les tokens
    const accessToken = jwt.sign(
      { id: newUser._id, roles: newUser.roles, email: newUser.email, userId: newUser._id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );


    const refreshToken = jwt.sign({ id: newUser._id }, REFRESH_TOKEN_SECRET);

    // Enregistrer la photo de profil de l'utilisateur
    const userPhoto = new UserPhotoModel({
      userId: newUser._id,
      photoUrl: `https://picsum.photos/400/600?random=${newUser._id}`
    });
    await userPhoto.save();

    // Stocker le refresh token
    newUser.refreshToken = refreshToken;
    await newUser.save();

    res.status(200).json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription.", error });
  }
};

/**
 * Log in a user.
 * @param req.body.email - The user's email address.
 * @param req.body.password - The user's password.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log(ACCESS_TOKEN_SECRET);
  console.log(REFRESH_TOKEN_SECRET);
  console.log(TOKEN_EXPIRATION);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email et mot de passe requis." });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Mot de passe incorrect." });
      return;
    }

    // Générer les tokens
    const accessToken = jwt.sign(
      { id: user._id, roles: user.roles, email: user.email, userId: user._id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET);

    // Stocker le refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion.", error });
  }
};

/**
 * Retrieve a user from an access token.
 * @header Authorization - Bearer token containing the access token.
 */
export const getUserFromToken = async (req: CustomRequest, res: Response): Promise<void> => {
  const userReq = req.user;

  try {
    // Convert the user document to a plain JavaScript object
    const user = await UserModel.findById(userReq?.id).select("-password").lean();
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable." });
      return;
    }

    // Retrieve user photos
    const userPhotos = await UserPhotoModel.find({ userId: user._id }).select("photoUrl").lean();

    // Append photos to the user object
    user.photos = userPhotos.map(photo => photo.photoUrl);

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
};

/**
 * Refresh an access token.
 * @param req.body.token - The refresh token.
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ message: "Token de rafraîchissement requis." });
    return;
  }

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as { id: string };
    const user = await UserModel.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      res.status(403).json({ message: "Token expiré." });
      return;
    }

    // Générer un nouveau token d'accès
    const newAccessToken = jwt.sign(
      { id: user._id, roles: user.roles, email: user.email, userId: user._id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    // Générer un nouveau token de rafraîchissement
    const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({ access_token: newAccessToken, refresh_token: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Token de rafraîchissement invalide ou expiré." });
  }
};

/**
 * Log out a user by invalidating the refresh token.
 * @param req.body.token - The refresh token to invalidate.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Token de rafraîchissement requis pour la déconnexion." });
    return;
  }

  try {
    const user = await UserModel.findOne({ refreshToken: token });
    if (!user) {
      res.status(403).json({ message: "Token invalide." });
      return;
    }

    // Supprimer le refresh token
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json({ message: "Déconnexion réussie." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la déconnexion.", error });
  }
};
