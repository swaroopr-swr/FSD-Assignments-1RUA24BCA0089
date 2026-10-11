export function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user._id?.toString?.() || user.id,
    username: user.username,
    plutoId: `@${user.username}`,
    avatar: user.avatar || "",
    createdAt: user.createdAt
  };
}

export function toConnectionCode(connectionCode) {
  if (!connectionCode) return null;

  return {
    id: connectionCode._id.toString(),
    code: connectionCode.code,
    expiresAt: connectionCode.expiresAt,
    active: connectionCode.active
  };
}

export function toConnectionRequest(connectionRequest) {
  if (!connectionRequest) return null;

  return {
    id: connectionRequest._id.toString(),
    sender: toPublicUser(connectionRequest.senderId),
    receiver: toPublicUser(connectionRequest.receiverId),
    status: connectionRequest.status,
    conversationId: connectionRequest.conversationId?.toString?.() || null,
    createdAt: connectionRequest.createdAt,
    updatedAt: connectionRequest.updatedAt
  };
}

export function toMessage(message) {
  if (!message) return null;

  return {
    id: message._id.toString(),
    conversationId: message.conversationId?.toString?.(),
    sender: toPublicUser(message.senderId),
    type: message.type,
    content: message.content,
    mediaUrl: message.mediaUrl,
    createdAt: message.createdAt
  };
}

export function toConversation(conversation, currentUserId, lastMessage = null) {
  if (!conversation) return null;

  const members = (conversation.members || []).map(toPublicUser);
  const currentId = currentUserId?.toString?.() || currentUserId;
  const partner = members.find((member) => member.id !== currentId) || members[0] || null;

  return {
    id: conversation._id.toString(),
    members,
    partner,
    lastMessage: lastMessage ? toMessage(lastMessage) : null,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt
  };
}
