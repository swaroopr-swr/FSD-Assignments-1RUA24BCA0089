import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { toConversation, toMessage } from "../utils/serializers.js";
import { requireConversationMember } from "./conversationController.js";

function validateMessageInput(type, content, mediaUrl) {
  if (!["text", "image"].includes(type)) {
    const error = new Error("Message type must be text or image");
    error.status = 400;
    throw error;
  }

  if (type === "text" && !content?.trim()) {
    const error = new Error("Text message cannot be empty");
    error.status = 400;
    throw error;
  }

  if (type === "image" && !mediaUrl?.trim()) {
    const error = new Error("Image message requires an image");
    error.status = 400;
    throw error;
  }
}

export async function listMessages(req, res, next) {
  try {
    await requireConversationMember(req.params.conversationId, req.user._id);

    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate("senderId");

    res.json({ messages: messages.map(toMessage) });
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { conversationId } = req.params;
    const type = req.body.type || "text";
    const content = req.body.content || "";
    const mediaUrl = req.body.mediaUrl || "";

    validateMessageInput(type, content, mediaUrl);

    const conversation = await requireConversationMember(conversationId, req.user._id);
    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      type,
      content: content.trim(),
      mediaUrl: mediaUrl.trim()
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate("senderId");
    const messagePayload = toMessage(populatedMessage);
    const populatedConversation = await Conversation.findById(conversationId).populate("members");
    const io = req.app.get("io");

    for (const member of populatedConversation.members) {
      const conversationPayload = toConversation(populatedConversation, member._id, populatedMessage);

      io?.to(`user:${member._id.toString()}`).emit("message:new", {
        message: messagePayload,
        conversation: conversationPayload
      });
    }

    res.status(201).json({ message: messagePayload });
  } catch (error) {
    next(error);
  }
}
