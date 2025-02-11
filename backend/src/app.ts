import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import connect from "@/config/conn";
import { env } from "@/config/env"; // Import de la configuration
import { rateLimit } from "@/middlewares/rateLimit";
import { errorHandler } from "@/middlewares/errorHandler";
import { logger } from "@/middlewares/logger";
import http from 'http';
import swipeRoutes from '@/routes/swipeRoutes';
import matchRoutes from '@/routes/matchRoutes';
import messageRoutes from '@/routes/messageRoutes';
import authRoutes from '@/routes/authRoutes';
import userRoutes from '@/routes/userRoutes';
import { WebSocketManager } from '@/websocket/webSocketManager';
import { insertFixtures } from '@/fixtures/data';

const app: Application = express();
const server = http.createServer(app);

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(logger);

// Connexion à MongoDB
connect();

// Limitation des requêtes
app.use(rateLimit(100, 60 * 1000));

// Insertion des fixtures
insertFixtures();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/swipes', swipeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route non trouvée." });
});

// Middleware de gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Lancer le serveur
server.listen(env.port, () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${env.port}`);
});

export const wsManager = new WebSocketManager();

export { app, server };
