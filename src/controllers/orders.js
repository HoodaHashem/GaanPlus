import { validationResult } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/orderSchema.js";
import NotificationCenter from "../utils/notificationCenter.js";

const notificationCenter = new NotificationCenter();

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
    deliveryAddress: req.body.deliveryAddress,
  }).save();
  await order.populate("orderItems.menuItemId userId restaurantId")

  const userNotification = await notificationCenter.sendOrderToUser(order);
  const restaurantNotification = await notificationCenter.sendOrderToRestaurant(
    order
  );

  if (!restaurantNotification.success) {
    console.error(
      `Failed to notify restaurant: ${restaurantNotification.error}`
    );
  }

  if (!userNotification.success) {
    console.error(
      `Failed to send confirmation to user: ${userNotification.error}`
    );
  }

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

  order.status = "OUT_FOR_DELIVERY";
  await order.save();
  const userNotification = await notificationCenter.sendOrderOutForDelivery(
    order
  );
  if (!userNotification.success) {
    console.error(
      `Failed to send confirmation to user: ${userNotification.error}`
    );
  }

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

  order.status = "DELIVERED";
  await order.save();

  const userNotification = await notificationCenter.sendOrderDelivered(order);
  if (!userNotification.success) {
    console.error(
      `Failed to send confirmation to user: ${userNotification.error}`
    );
  }
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

  order.status = "CANCELLED";
  await order.save();

  const userNotification = await notificationCenter.sendOrderCancelledToUser(
    order
  );
  const restaurantNotification =
    await notificationCenter.sendOrderCancelledToRestaurant(order);
  if (!restaurantNotification.success) {
    console.error(
      `Failed to notify restaurant: ${restaurantNotification.error}`
    );
  }
  if (!userNotification.success) {
    console.error(
      `Failed to send confirmation to user: ${userNotification.error}`
    );
  }

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

export const rejectOrder = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      errors: errors.array(),
    });
  }
  const order = req.order;

  order.status = "REJECTED";
  await order.save();

  const userNotification = await notificationCenter.sendOrderRejected(order);
  if (!userNotification.success) {
    console.error(
      `Failed to send confirmation to user: ${userNotification.error}`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Order rejected successfully",
  });
});
