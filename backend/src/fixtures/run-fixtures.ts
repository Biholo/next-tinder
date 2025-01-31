import { insertFixtures } from './data';
import connect from '../config/conn';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    try {
        // Connexion à la base de données
        await connect();
        
        // Insertion des fixtures
        await insertFixtures();
        
        console.log('Script terminé avec succès');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'exécution du script:', error);
        process.exit(1);
    }
})(); 