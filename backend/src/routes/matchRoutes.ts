import express from "express";
import { getMatches } from "@/controllers/matchController";
import { isAuthenticated } from "@/middlewares/auth";

const router = express.Router();

router.get('/',
  isAuthenticated,
  getMatches
);

export default router; 