import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      unique: true,
    },
    participants: {
      type: [String],
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
      // A short-lived token used by the frontend to show/verify the room
      token: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      // Expiration timestamp for the token
      tokenExpiresAt: {
        type: Date,
        required: true,
        index: true,
      },
  },
  { timestamps: true }
);

// TTL index: MongoDB will automatically remove documents once `tokenExpiresAt` is older than now.
// expireAfterSeconds: 0 means expire at the time specified in the field.
chatSchema.index({ tokenExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const Chat = mongoose.model("Chat", chatSchema);

