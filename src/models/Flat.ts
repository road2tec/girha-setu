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
      enum: [
        "Apartment",
        "House",
        "Villa",
        "Penthouse",
        "Studio",
        "Office",
        "Building",
        "Townhouse",
        "Shop",
        "Garage",
      ],
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
          "Air Conditioning",
          "Furnished",
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
    rating: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

FlatSchema.index({ "location.coordinates": "2dsphere" });
FlatSchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.models.Flat || mongoose.model("Flat", FlatSchema);
