import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import Restaurant from "../models/restaurantSchema.js";

export const createRestaurant = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, address, email, phoneNumber } = req.body;
  const userId = req.user.id;

  const restaurant = await new Restaurant({
    name,
    address,
    email,
    ownerId: userId,
    phoneNumber,
  }).save();

  res.status(201).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

export const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({
    isActive: true,
  }).select({
    id: true,
    name: true,
    address: true,
    email: true,
    phoneNumber: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      restaurants,
    },
  });
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  res.status(200).json({
    status: "success",
    data: {
      restaurant: req.restaurant,
    },
  });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const restaurant = req.restaurant;
  // soft delete
  restaurant.isActive = false;
  restaurant.deletedAt = new Date();
  await restaurant.save();
  
  res.status(204).json({
    status: "success",
    data: null,
  });
});
