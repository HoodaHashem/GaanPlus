import { validationResult } from "express-validator";
import prisma from "../utils/prisma.js";

export const createMenuItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, price, restaurantId } = req.body;
  const menuItem = await prisma.menuItem.create({
    data: {
      name,
      description,
      price,
      restaurant: {
        connect: {
          id: restaurantId,
        },
      },
    },
  });

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
  // const restaurantId = req.body.restaurantId;

  // const menuItems = await prisma.menuItem.findMany({
  //   where: { restaurantId: req.params.id },
  // });
  res.status(200).json({
    status: "success",
    data: {
      menu: req.items,
    },
  });
});

export const getMenuItemById = asyncHandler(async (req, res) => {
  const menuItem = await prisma.menuItem.findUnique({
    where: {
      id: req.params.id,
    },
  });

  if (!menuItem) {
    return res.status(404).json({
      status: "fail",
      message: "Menu item not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      menuItem,
    },
  });
});
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await prisma.menuItem.delete({
    where: {
      id: req.params.id,
    },
  });

  if (!menuItem) {
    return res.status(404).json({
      status: "fail",
      message: "Menu item not found",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
