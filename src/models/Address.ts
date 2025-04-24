import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema({
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  coordinates: {
    type: { type: String, default: "Point" },
    coordinates: {
      type: [Number, Number],
      required: true,
      index: "2dsphere",
    },
  },
  landmark: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);

export default Address;
