import mongoose from 'mongoose';

// Fonction pour se connecter à MongoDB
const connect = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI non définie dans les variables d\'environnement');
    }

    // Connexion à MongoDB
    await mongoose.connect(uri);

    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur lors de la connexion à MongoDB :', error);
    process.exit(1);  // Arrêter le serveur si pas de connexion à la DB
  }
};

// Export de la fonction de connexion
export default connect;
