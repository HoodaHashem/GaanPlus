import prisma from "../utils/prisma";

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
    custom: {
      options: (value) => {
        const exists = prisma.restaurant.findUnique({
          where: {
            id: value,
          },
        });
        if (!exists) {
          throw new Error("Restaurant ID does not exist");
        }
        return true;
      }
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
      options: (value) => {
        const exists = prisma.restaurant.findUnique({
          where: {
            id: value,
          },
          select: {
            menuItems: true,
          }
        });
        if (!exists) {
          throw new Error("Restaurant ID does not exist");
        }
        req.items = exists.menuItems;
        return true;
      }
    },
  },
};
