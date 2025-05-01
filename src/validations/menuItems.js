import MenuItem from "../models/menuItemSchema.js";
import Restaurant from "../models/restaurantSchema.js";

export const createMenuItemValidation = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  description: {
    in: ["body"],
    isString: {
      errorMessage: "Description must be a string",
    },
    notEmpty: {
      errorMessage: "Description is required",
    },
  },
  price: {
    in: ["body"],
    isFloat: {
      errorMessage: "Price must be a number",
    },
    notEmpty: {
      errorMessage: "Price is required",
    },
  },
  restaurantId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Restaurant ID is required",
    },
    isMongoId: {
      errorMessage: "Restaurant ID must be a valid MongoDB ObjectId",
    },
    custom: {
      options: async (value, { req }) => {
        const userId = req.user.id;

        const items = await Restaurant.findById(value);
        if (!items) {
          throw new Error("Restaurant ID does not exist");
        }
        if (items.ownerId.toString() !== userId) {
          throw new Error(
            "You are not authorized to create a menu item for this restaurant"
          );
        }
        req.restaurant = items;
        return true;
      },
    },
  },
};

export const getRestaurantMenuItemsValidation = {
  restaurantId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Restaurant ID is required",
    },
    custom: {
      options: async (value, { req }) => {
        const restaurantId = await Restaurant.findById(value);
        if (!restaurantId) {
          throw new Error("Restaurant ID does not exist");
        }
        const items = await MenuItem.find({
          restaurantId: value,
        });
        req.items = items;
        return true;
      },
    },
  },
};

export const deleteMenuItemValidation = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Menu item ID is required",
    },
    custom: {
      options: async (value, { req }) => {
        const userId = req.user.id;
        const menuItem = await MenuItem.findById(req.params.id).populate({
          path: "restaurantId",
          select: "ownerId",
        });
        if (!menuItem) {
          throw new Error("Menu item ID does not exist");
        }

        const ownerId = menuItem.restaurantId.ownerId.toString();
        if (userId !== ownerId) {
          throw new Error("You are not authorized to delete this menu item");
        }
        req.menuItem = menuItem;
      },
    },
  },
};

export const getMenuItemByIdValidation = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Menu item ID is required",
    },
    custom: {
      options: async (value, { req }) => {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
          throw new Error("Menu item ID does not exist");
        }

        req.menuItem = menuItem;
      },
    },
  },
};
