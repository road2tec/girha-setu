import mongoose from "mongoose";

const FlatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Penthouse", "Studio"],
      required: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        type: { type: String, default: "Point" },
        coordinates: [Number],
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    broker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      url: String,
      caption: String,
    },
    amenities: [
      {
        type: String,
        enum: [
          "Parking",
          "Swimming Pool",
          "Gym",
          "Balcony",
          "Security",
          "Power Backup",
          "WiFi",
          "Garden",
        ],
      },
    ],
    bedrooms: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number, // in square feet
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    availabilityCalendar: [
      {
        date: Date,
        available: Boolean,
      },
    ],
    favoritesCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Enable geospatial queries
FlatSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.models.Flat || mongoose.model("Flat", FlatSchema);
