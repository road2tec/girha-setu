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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mainImage: {
      type: String,
      required: true,
    },
    images: [String],
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
    bhks: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    bookings: [
      {
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    favoritesCount: {
      type: Number,
      default: 0,
    },
    rating: [
      {
        type: Number,
        default: 0,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Enable geospatial queries
FlatSchema.index({ "location.coordinates": "2dsphere" });
FlatSchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.models.Flat || mongoose.model("Flat", FlatSchema);
