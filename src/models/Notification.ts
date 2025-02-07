import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["New Listing", "Price Drop", "Booking Update", "Admin Message"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
