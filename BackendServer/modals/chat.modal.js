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

export const Chat = mongoose.model("Chat", chatSchema);
