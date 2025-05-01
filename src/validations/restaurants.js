import Restaurant from "../models/restaurantSchema.js";

export const createRestaurantValidation = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string",
    },
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  phoneNumber: {
    in: ["body"],
    isString: {
      errorMessage: "Phone number must be a string",
    },
    notEmpty: {
      errorMessage: "Phone number is required",
    },
    isLength: {
      options: { min: 10, max: 15 },
      errorMessage: "Phone number must be between 10 and 15 characters",
    },
    matches: {
      options: /^[0-9]+$/,
      errorMessage: "Phone number must contain only digits",
    },
  },
  address: {
    in: ["body"],
    isString: {
      errorMessage: "Address must be a string",
    },
    notEmpty: {
      errorMessage: "Address is required",
    },
  },
  email: {
    in: ["body"],
    isEmail: {
      errorMessage: "Email must be a valid email address",
    },
    notEmpty: {
      errorMessage: "Email is required",
    },
    custom: {
      options: async (value, { req }) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          throw new Error("Please enter a valid email");
        }
        // Check if the email already exists in the database
        const exists = await Restaurant.findOne({
          email: value,
          isActive: true,
        });
        // If the email already exists, reject the promise
        if (exists) {
          throw new Error("Email already exists");
        } else {
          return Promise.resolve();
        }
      },
    },
  },
};

export const getRestaurantByIdValidation = {
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid restaurant ID",
    },
    notEmpty: {
      errorMessage: "Restaurant ID is required",
    },
    custom: {
      options: async (value, { req }) => {
        // Check if the restaurant ID exists in the database
        const restaurant = await Restaurant.findOne({
          _id: value,
          isActive: true,
        }).select({
          id: true,
          name: true,
          address: true,
          email: true,
          phoneNumber: true,
        });
        // If the restaurant ID does not exist, reject the promise
        if (!restaurant) {
          throw new Error("Restaurant not found");
        } else {
          req.restaurant = restaurant;
          return Promise.resolve();
        }
      },
    },
  },
};

export const deleteRestaurantValidation = {
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid restaurant ID",
    },
    notEmpty: {
      errorMessage: "Restaurant ID is required",
    },
    custom: {
      options: async (value, { req }) => {
        // Check if the restaurant ID exists in the database
        const restaurant = await Restaurant.findOne({
          _id: value,
          isActive: true,
        });
        // If the restaurant ID does not exist, reject the promise
        if (!restaurant) {
          throw new Error("Restaurant not found");
        }
        const userId = req.user.id;
        const ownerId = restaurant.ownerId.toString();
        if (userId !== ownerId) {
          throw new Error("You are not authorized to delete this restaurant");
        }
        req.restaurant = restaurant;
      },
    },
  },
};
