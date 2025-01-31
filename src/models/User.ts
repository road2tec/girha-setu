import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "owner", "agent", "admin"],
      default: "buyer",
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
      },
    ],
    profilePicture: {
      type: String,
      default: "",
    },
    searchHistory: [
      {
        query: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    notifications: [
      {
        message: String,
        seen: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
