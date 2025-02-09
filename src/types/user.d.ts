import mongoose from "mongoose";
import { Address } from "./Address";

export interface User {
  _id?: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "buyer" | "owner" | "agent" | "admin";
  favorites?: [{ type: mongoose.Schema.Types.ObjectId; ref: "Flat" }];
  profilePicture: string;
  searchHistory?: [{ query: string; timestamp: Date }];
  address: Address;
  notifications?: [{ message: string; seen: boolean; timestamp: Date }];
  createdAt?: Date;
  isAdminApproved: boolean;
}
