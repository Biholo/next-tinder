import dotenv from "dotenv";
import path from "path";

// Charger les variables d'environnement
dotenv.config();

// Vérifier les variables essentielles
const requiredEnvVars = [
  'ACCESS_TOKEN_SECRET',
  'REFRESH_TOKEN_SECRET',
  'MONGODB_URI',
  'WEBSOCKET_PORT',
  'PORT'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Variables d\'environnement manquantes:');
  missingEnvVars.forEach(varName => {
    console.error(`- ${varName} non défini`);
  });
  process.exit(1);
}

// Exporter les variables d'environnement typées
export const env = {
  port: process.env.PORT || '3000',
  mongodbUri: process.env.MONGODB_URI as string,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
  websocketPort: process.env.WEBSOCKET_PORT || '3001',
  pingInterval: process.env.PING_INTERVAL || '30000'
} as const; 