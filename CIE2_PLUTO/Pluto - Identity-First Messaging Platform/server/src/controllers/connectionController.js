import ConnectionCode from "../models/ConnectionCode.js";
import ConnectionRequest from "../models/ConnectionRequest.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { generateConnectionCode, normalizeConnectionCode } from "../utils/codes.js";
import {
  toConnectionCode,
  toConnectionRequest,
  toConversation
} from "../utils/serializers.js";

async function createUniqueConnectionCode() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = generateConnectionCode();
    const exists = await ConnectionCode.exists({ code });

    if (!exists) return code;
  }

  const error = new Error("Could not generate a unique connection code");
  error.status = 500;
  throw error;
}

async function getActiveCodeForUser(userId) {
  return ConnectionCode.findOne({
    userId,
    active: true,
    expiresAt: { $gt: new Date() }
  }).sort({ createdAt: -1 });
}

async function serializeConversationFor(conversation, userId) {
  const populated = await conversation.populate("members");
  const lastMessage = await Message.findOne({ conversationId: conversation._id })
    .sort({ createdAt: -1 })
    .populate("senderId");

  return toConversation(populated, userId, lastMessage);
}

export async function getMyConnectionCode(req, res, next) {
  try {
    const connectionCode = await getActiveCodeForUser(req.user._id);
    res.json({ connectionCode: toConnectionCode(connectionCode) });
  } catch (error) {
    next(error);
  }
}

export async function generateMyConnectionCode(req, res, next) {
  try {
    await ConnectionCode.updateMany(
      { userId: req.user._id, active: true },
      { $set: { active: false } }
    );

    const minutes = Number(process.env.CONNECTION_CODE_MINUTES || 30);
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    const code = await createUniqueConnectionCode();

    const connectionCode = await ConnectionCode.create({
      code,
      userId: req.user._id,
      expiresAt
    });

    res.status(201).json({ connectionCode: toConnectionCode(connectionCode) });
  } catch (error) {
    next(error);
  }
}

export async function createConnectionRequest(req, res, next) {
  try {
    const code = normalizeConnectionCode(req.body.code);

    if (!code) {
      const error = new Error("Connection code is required");
      error.status = 400;
      throw error;
    }

    const connectionCode = await ConnectionCode.findOne({
      code,
      active: true,
      expiresAt: { $gt: new Date() }
    });

    if (!connectionCode) {
      const error = new Error("This connection code is invalid or expired");
      error.status = 404;
      throw error;
    }

    const senderId = req.user._id;
    const receiverId = connectionCode.userId;

    if (senderId.equals(receiverId)) {
      const error = new Error("You cannot connect with your own Pluto code");
      error.status = 400;
      throw error;
    }

    const existingConversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (existingConversation) {
      const error = new Error("You are already connected with this user.");
      error.status = 409;
      throw error;
    }

    const existingPending = await ConnectionRequest.findOne({
      status: "pending",
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });

    if (existingPending) {
      const error = new Error("A connection request between these users is already pending");
      error.status = 409;
      throw error;
    }

    const connectionRequest = await ConnectionRequest.create({ senderId, receiverId });
    const populatedRequest = await connectionRequest.populate("senderId receiverId");
    const payload = toConnectionRequest(populatedRequest);

    req.app.get("io")?.to(`user:${receiverId.toString()}`).emit("connection:request", payload);

    res.status(201).json({ connectionRequest: payload });
  } catch (error) {
    next(error);
  }
}

export async function listConnectionRequests(req, res, next) {
  try {
    const requests = await ConnectionRequest.find({
      status: "pending",
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .populate("senderId receiverId");

    res.json({
      incoming: requests
        .filter((request) => request.receiverId._id.equals(req.user._id))
        .map(toConnectionRequest),
      outgoing: requests
        .filter((request) => request.senderId._id.equals(req.user._id))
        .map(toConnectionRequest)
    });
  } catch (error) {
    next(error);
  }
}

export async function respondToConnectionRequest(req, res, next) {
  try {
    const { action } = req.body;
    const connectionRequest = await ConnectionRequest.findById(req.params.id);

    if (!connectionRequest || connectionRequest.status !== "pending") {
      const error = new Error("Pending connection request was not found");
      error.status = 404;
      throw error;
    }

    if (!connectionRequest.receiverId.equals(req.user._id)) {
      const error = new Error("Only the receiver can respond to this request");
      error.status = 403;
      throw error;
    }

    if (!["accept", "decline"].includes(action)) {
      const error = new Error("Action must be accept or decline");
      error.status = 400;
      throw error;
    }

    if (action === "decline") {
      const senderId = connectionRequest.senderId.toString();
      connectionRequest.status = "declined";
      await connectionRequest.save();
      const declined = await connectionRequest.populate("senderId receiverId");
      const payload = toConnectionRequest(declined);

      req.app.get("io")?.to(`user:${senderId}`).emit("connection:declined", payload);

      res.json({ connectionRequest: payload });
      return;
    }

    const senderId = connectionRequest.senderId.toString();
    const receiverId = connectionRequest.receiverId.toString();

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [connectionRequest.senderId, connectionRequest.receiverId]
      });
    }

    connectionRequest.status = "accepted";
    connectionRequest.conversationId = conversation._id;
    await connectionRequest.save();

    const populatedRequest = await connectionRequest.populate("senderId receiverId");
    const senderConversation = await serializeConversationFor(conversation, senderId);
    const receiverConversation = await serializeConversationFor(conversation, receiverId);
    const requestPayload = toConnectionRequest(populatedRequest);

    const io = req.app.get("io");
    io?.to(`user:${senderId}`).emit("connection:accepted", {
      connectionRequest: requestPayload,
      conversation: senderConversation
    });
    io?.to(`user:${receiverId}`).emit("connection:accepted", {
      connectionRequest: requestPayload,
      conversation: receiverConversation
    });

    res.json({
      connectionRequest: requestPayload,
      conversation: receiverConversation
    });
  } catch (error) {
    next(error);
  }
}
