import { Router } from "express";

import {
  createConnectionRequest,
  generateMyConnectionCode,
  getMyConnectionCode,
  listConnectionRequests,
  respondToConnectionRequest
} from "../controllers/connectionController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/code", getMyConnectionCode);
router.post("/code", generateMyConnectionCode);
router.get("/requests", listConnectionRequests);
router.post("/requests", createConnectionRequest);
router.patch("/requests/:id", respondToConnectionRequest);

export default router;
