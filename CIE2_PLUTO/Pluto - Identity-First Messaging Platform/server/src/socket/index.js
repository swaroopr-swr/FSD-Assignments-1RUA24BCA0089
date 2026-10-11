import jwt from "jsonwebtoken";
import { Server } from "socket.io";

import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { toPublicUser } from "../utils/serializers.js";

export function createSocketServer(httpServer) {
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

  const io = new Server(httpServer, {
    cors: {
      origin: clientOrigin,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        const error = new Error("Socket authentication token is required");
        error.data = { status: 401 };
        throw error;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
      const user = await User.findById(payload.sub).select("-passwordHash");

      if (!user) {
        const error = new Error("Socket user was not found");
        error.data = { status: 401 };
        throw error;
      }

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id.toString()}`);
    socket.emit("socket:ready", { user: toPublicUser(socket.user) });

    socket.on("conversation:join", async (conversationId, callback) => {
      try {
        const conversation = await Conversation.findById(conversationId);
        const isMember = conversation?.members.some((member) => member.equals(socket.user._id));

        if (!conversation || !isMember) {
          callback?.({ ok: false, message: "Conversation unavailable" });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        callback?.({ ok: true });
      } catch (error) {
        callback?.({ ok: false, message: error.message });
      }
    });
  });

  return io;
}
