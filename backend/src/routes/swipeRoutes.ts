import express from "express";
import { createSwipe } from "@/controllers/swipeController";
import { createSwipeSchema } from "@/validators/swipeValidator";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";

const router = express.Router();

router.post('/', 
  isAuthenticated,
  validate(createSwipeSchema, "body"),
  createSwipe
);

export default router; 