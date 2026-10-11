import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { toConversation } from "../utils/serializers.js";

async function requireConversationMember(conversationId, userId) {
  const conversation = await Conversation.findById(conversationId).populate("members");

  if (!conversation) {
    const error = new Error("Conversation was not found");
    error.status = 404;
    throw error;
  }

  const isMember = conversation.members.some((member) => member._id.equals(userId));

  if (!isMember) {
    const error = new Error("You do not have access to this conversation");
    error.status = 403;
    throw error;
  }

  return conversation;
}

export async function listConversations(req, res, next) {
  try {
    const conversations = await Conversation.find({ members: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("members");

    const payload = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({ conversationId: conversation._id })
          .sort({ createdAt: -1 })
          .populate("senderId");

        return toConversation(conversation, req.user._id, lastMessage);
      })
    );

    res.json({ conversations: payload });
  } catch (error) {
    next(error);
  }
}

export async function getConversation(req, res, next) {
  try {
    const conversation = await requireConversationMember(req.params.id, req.user._id);
    const lastMessage = await Message.findOne({ conversationId: conversation._id })
      .sort({ createdAt: -1 })
      .populate("senderId");

    res.json({ conversation: toConversation(conversation, req.user._id, lastMessage) });
  } catch (error) {
    next(error);
  }
}

export { requireConversationMember };
