import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import prisma from "../utils/prisma.js";

export const createRestaurant = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, address, email } = req.body;
  const userId = req.user.id;
  const restaurant = await prisma.restaurant.create({
    data: {
      name,
      address,
      email,
      owner: {
        connect: {
          id: userId,
        },
      },
    }
  })
  res.status(201).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

export const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
      address: true,
      email: true,
    }
  })

  res.status(200).json({
    status: "success",
    data: {
      restaurants,
    },
  });
});

export const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      address: true,
      email: true,
    },
  });

  if (!restaurant) {
    return res.status(404).json({
      status: "fail",
      message: "Restaurant not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      restaurant,
    },
  });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
    },
  });
  if (!restaurant) {
    return res.status(404).json({
      status: "fail",
      message: "Restaurant not found",
    });
  }
  if (restaurant.ownerId !== userId) {
    return res.status(403).json({
      status: "fail",
      message: "You are not authorized to delete this restaurant",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
