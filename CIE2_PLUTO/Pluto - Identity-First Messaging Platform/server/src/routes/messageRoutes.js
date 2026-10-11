import { Router } from "express";

import { listMessages, sendMessage } from "../controllers/messageController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/:conversationId", listMessages);
router.post("/:conversationId", sendMessage);

export default router;
