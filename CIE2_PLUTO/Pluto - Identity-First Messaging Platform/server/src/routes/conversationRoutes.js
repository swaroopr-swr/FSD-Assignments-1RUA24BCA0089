import { Router } from "express";

import { getConversation, listConversations } from "../controllers/conversationController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", listConversations);
router.get("/:id", getConversation);

export default router;
