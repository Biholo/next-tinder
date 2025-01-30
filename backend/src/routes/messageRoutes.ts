import express from "express";
import { createMessage, getMatchMessages } from "@/controllers/messageController";
import { createMessageSchema } from "@/validators/messageValidator";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";

const router = express.Router();

router.post('/',
  isAuthenticated,
  validate(createMessageSchema, "body"),
  createMessage
);

router.get('/:match_id',
  isAuthenticated,
  getMatchMessages
);

export default router; 