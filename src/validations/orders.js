import MenuItem from "../models/menuItemSchema.js";
import Order from "../models/orderSchema.js";
import Restaurant from "../models/restaurantSchema.js";

export const createOrderValidation = {
  orderItems: {
    in: ["body"],
    isArray: {
      options: { min: 1 },
      errorMessage: "orderItems must be a non-empty array",
    },
  },

  "orderItems.*.menuItemId": {
    in: ["body"],
    isMongoId: {
      errorMessage: "Each menuItemId must be a valid ID",
    },
  },

  orderItems: {
    in: ["body"],
    custom: {
      options: async (items, { req }) => {
        const ids = items.map((i) => i.menuItemId);
        const found = await MenuItem.find({ _id: { $in: ids } })
          .select("_id isAvailable price")
          .lean();

        if (found.length !== ids.length) {
          throw new Error("One or more menu items not found");
        }

        const unavailable = found.filter((i) => !i.isAvailable);
        if (unavailable.length) {
          throw new Error(
            `Menu item(s) unavailable: ${unavailable
              .map((i) => i._id)
              .join(", ")}`
          );
        }

        const totalPrice = found.reduce((total, item) => {
          const menuItem = item;
          return (
            total +
            menuItem.price *
              items.find((i) => i.menuItemId.toString() === item._id.toString())
                .quantity
          );
        }, 0);
        req.totalPrice = totalPrice;
        return true;
      },
    },
  },

  "orderItems.*.quantity": {
    in: ["body"],
    isInt: {
      options: { gt: 0 },
      errorMessage: "Each quantity must be an integer greater than 0",
    },
  },

  restaurantId: {
    in: ["body"],
    isMongoId: {
      errorMessage: "restaurantId must be a valid ID",
    },
    custom: {
      options: async (id, { req }) => {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }
        return true;
      },
    },
  },

  deliveryAddress: {
    in: ["body"],
    isString: true,
    errorMessage: "deliveryAddress must be a string",
    isLength: {
      options: { min: 1 },
      errorMessage: "deliveryAddress cannot be empty",
    },
  },
};

export const getOrderByIdValidation = {
  id: {
    in: "params",
    isString: true,
    errorMessage: "Order ID must be a string",
    custom: {
      options: async (value, { req }) => {
        const order = await Order.findById(value).populate(
          "orderItems.menuItemId userId restaurantId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        req.order = order;
      },
    },
  },
};

export const cancelOrderValidation = {
  id: {
    in: "params",
    isString: true,
    errorMessage: "Order ID must be a string",
    custom: {
      options: async (value, { req }) => {
        const order = await Order.findById(value).populate(
          "orderItems.menuItemId userId restaurantId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        const user = req.user;
        if (order.userId.id.toString() !== user.id) {
          throw new Error("You are not authorized to cancel this order");
        }

        if (order.status === "CANCELLED") {
          throw new Error("The order is already canceled");
        }

        if (order.status === "DELIVERED") {
          throw new Error("The order is already delivered");
        }

        req.order = order;
      },
    },
  },
};

export const prepareOrderValidation = {
  id: {
    in: "params",
    isString: true,
    errorMessage: "Order ID must be a string",
    custom: {
      options: async (value, { req }) => {
        const order = await Order.findById(value).populate(
          "orderItems.menuItemId userId restaurantId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        const user = req.user;
        const restaurant = await Restaurant.findById(
          order.restaurantId
        ).populate("ownerId");

        if (restaurant.ownerId._id.toString() !== user.id) {
          throw new Error("You are not authorized to prepare this order");
        }

        if (order.status !== "PENDING") {
          throw new Error("Order is not in pending state");
        }

        req.order = order;
      },
    },
  },
};

export const deliverOrderValidation = {
  id: {
    in: "params",
    isString: true,
    errorMessage: "Order ID must be a string",
    custom: {
      options: async (value, { req }) => {
        const order = await Order.findById(value).populate(
          "orderItems.menuItemId userId restaurantId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        const user = req.user;
        const restaurant = await Restaurant.findById(
          order.restaurantId
        ).populate("ownerId");

        if (restaurant.ownerId._id.toString() !== user.id) {
          throw new Error("You are not authorized to deliver this order");
        }

        if (order.status !== "PREPARING") {
          throw new Error("Order is not in preparing state");
        }

        req.order = order;
      },
    },
  },
};

export const completeOrderValidation = {
  id: {
    in: "params",
    isString: true,
    errorMessage: "Order ID must be a string",
    custom: {
      options: async (value, { req }) => {
        const order = await Order.findById(value).populate(
          "orderItems.menuItemId userId restaurantId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        const user = req.user;
        if (order.userId.toString() !== user.id) {
          throw new Error("You are not authorized to complete this order");
        }

        if (order.status !== "OUT_FOR_DELIVERY") {
          throw new Error("Order is not in out for delivery state");
        }

        req.order = order;
      },
    },
  },
};

export const rejectOrderValidation = {
  id: {
    in: "params",
    isString: true,
    errorMessage: "Order ID must be a string",
    custom: {
      options: async (value, { req }) => {
        const order = await Order.findById(value).populate(
          "orderItems.menuItemId userId restaurantId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        const user = req.user;
        const restaurant = await Restaurant.findById(
          order.restaurantId
        ).populate("ownerId");

        if (restaurant.ownerId._id.toString() !== user.id) {
          throw new Error("You are not authorized to reject this order");
        }

        if (order.status !== "PENDING") {
          throw new Error("Order is not in pending state");
        }

        req.order = order;
      },
    },
  },
};
