import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/orderSchema.js";

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await Order.find({
    userId: userId,
  }).populate("orderItems.menuItemId");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {

  res.status(200).json({
    status: "success",
    data: {
      order: req.order,
    },
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const userId = req.user.id;
  const { orderItems } = req.body;

  const order = await new Order({
    userId: userId,
    restaurantId: req.body.restaurantId,
    orderItems: orderItems.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    })),
    totalPrice: req.totalPrice,
  }).save();

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});


export const prepareOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  const order = req.order;

  if (order.status !== "PENDING") {
    return res.status(400).json({
      status: "fail",
      message: "Order is not in pending state",
    });
  }

  order.status = "PREPARING";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order prepared successfully",
  });
});

export const deliverOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  const order = req.order;

  if (order.status !== "PREPARING") {
    return res.status(400).json({
      status: "fail",
      message: "Order is not in preparing state",
    });
  }

  order.status = "OUT_FOR_DELIVERY";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order is out for delivery successfully",
  });
});

export const completeOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  const order = req.order;

  if (order.status !== "OUT_FOR_DELIVERY") {
    return res.status(400).json({
      status: "fail",
      message: "Order is not in out for delivery state",
    });
  }

  order.status = "DELIVERED";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order delivered successfully",
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  const order = req.order;

  if (order.status === "CANCELLED") {
    return res.status(400).json({
      status: "fail",
      message: "Order is already cancelled",
    });
  }

  if (order.status === "DELIVERED") {
    return res.status(400).json({
      status: "fail",
      message: "Order is already delivered",
    });
  }

  order.status = "CANCELLED";
  await order.save();

  res.status(200).json({
    status: "success",
    message: "Order cancelled successfully",
  });
});

export const getOrderItems = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const order = await Order.findOne({
    userId: userId,
    _id: orderId,
  }).populate("orderItems.menuItemId");

  if (!order) {
    return res.status(404).json({
      status: "fail",
      message: "Order not found",
    });
  }
  const orderItems = order.orderItems.map((item) => ({
    menuItem: item.menuItemId,
    quantity: item.quantity,
  }));

  res.status(200).json({
    status: "success",
    results: orderItems.length,
    data: {
      orderItems,
    },
  });
});
