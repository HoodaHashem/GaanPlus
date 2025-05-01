import { Router } from "express";
import User from "../models/userSchema.js";
import Restaurant from "../models/restaurantSchema.js";
import MenuItem from "../models/menuItemSchema.js";
import Order from "../models/orderSchema.js";

const adminRouter = Router();

adminRouter.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

adminRouter.delete("/users", async (req, res) => {
  await User.deleteMany();
  res.status(200).json({
    status: "success",
    message: "All users deleted",
  });
});

adminRouter.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.find()
  res.status(200).json({
    status: "success",
    data: {
      restaurants,
    },
  });
});

adminRouter.delete("/restaurants", async (req, res) => {
  await Restaurant.deleteMany()
  res.status(200).json({
    status: "success",
    message: "All restaurants deleted",
  });
});

adminRouter.get("/menu-items", async (req, res) => {
  const menuItems = await MenuItem.find()
  res.status(200).json({
    status: "success",
    data: {
      menuItems,
    },
  });
});

adminRouter.delete("/menu-items", async (req, res) => {
  await MenuItem.deleteMany();
  res.status(200).json({
    status: "success",
    message: "All menu items deleted",
  });
});

adminRouter.get("/orders", async (req, res) => {
  const orders = await Order.find()
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

adminRouter.delete("/orders", async (req, res) => {
  await Order.deleteMany();
  res.status(200).json({
    status: "success",
    message: "All orders deleted",
  });
});

adminRouter.get("/menu-items", async (req, res) => {
  const menuItems = await MenuItem.findMany();
  res.status(200).json({
    status: "success",
    data: {
      menuItems,
    },
  });
});
adminRouter.delete("/menu-items", async (req, res) => {
  await MenuItem.deleteMany();
  res.status(200).json({
    status: "success",
    message: "All menu items deleted",
  });
});
adminRouter.get("/orders", async (req, res) => {
  const orders = await Order.findMany();
  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});
adminRouter.delete("/orders", async (req, res) => {
  await Order.deleteMany();
  res.status(200).json({
    status: "success",
    message: "All orders deleted",
  });
});
export default adminRouter;
