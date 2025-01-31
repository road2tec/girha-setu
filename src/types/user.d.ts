import mongoose from "mongoose";

export interface User {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "buyer" | "owner" | "agent" | "admin";
  favorites?: [{ type: mongoose.Schema.Types.ObjectId; ref: "Flat" }];
  profilePicture: string;
  searchHistory?: [{ query: string; timestamp: Date }];
  notifications?: [{ message: string; seen: boolean; timestamp: Date }];
  createdAt?: Date;
}
