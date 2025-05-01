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
      options: async (id) => {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }
        return true;
      },
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
          "orderItems.menuItemId"
        );

        if (!order) {
          throw new Error("Order not found");
        }
        req.order = order;
      },
    },
  },
};
