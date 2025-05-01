import mongoClient from "../config/mongoClient.js";
import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
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
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },

  isAvailable: {
    type: Boolean,
    default: true,
  },
  //* For future use
  // imageUrl: {
  //   type: String,
  //   required: false,
  // },
}, { timestamps: true });

const MenuItem = mongoClient.model("MenuItem", menuItemSchema);
export default MenuItem;
