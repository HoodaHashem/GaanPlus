import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js"
import Restaurant from "../models/restaurantSchema.js";
import MenuItem from "../models/menuItemSchema.js";

//TODO: I need middleware to check if the user is the owner of the restaurant
export const createMenuItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, price, restaurantId } = req.body;

  const menuItem = await new MenuItem({
    name,
    description,
    price,
    restaurantId,
  }).save();

  res.status(201).json({
    status: "success",
    data: {
      menuItem,
    },
  });
});

export const getRestaurantMenuItems = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(200).json({
    status: "success",
    data: {
      menu: req.items,
    },
  });
});

export const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = req.menuItem;

  res.status(200).json({
    status: "success",
    data: {
      menuItem,
    },
  });
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const menuItem = req.menuItem
  await menuItem.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
