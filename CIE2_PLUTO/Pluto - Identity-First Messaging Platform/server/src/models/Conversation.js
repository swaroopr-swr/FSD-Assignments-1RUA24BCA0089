import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      ],
      validate: {
        validator(members) {
          return members.length === 2;
        },
        message: "A Pluto conversation must have exactly two members"
      }
    },
    pairKey: {
      type: String,
      unique: true,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

conversationSchema.pre("validate", function buildPairKey(next) {
  if (this.members?.length === 2) {
    this.pairKey = this.members.map((member) => (member._id ? member._id.toString() : member.toString())).sort().join(":");
  }

  next();
});

export function createPairKey(firstUserId, secondUserId) {
  const id1 = firstUserId._id ? firstUserId._id.toString() : firstUserId.toString();
  const id2 = secondUserId._id ? secondUserId._id.toString() : secondUserId.toString();
  return [id1, id2].sort().join(":");
}

export default mongoose.model("Conversation", conversationSchema);
