import prisma from "../utils/prisma.js";

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
          return Promise.reject("Please enter a valid email");
        }
        // Check if the email already exists in the database
        const exists = await prisma.restaurant.findUnique({
          where: {
            email: value,
          },
        });
        if (exists) {
          throw new Error("Email already exists");
        } else {
          return Promise.resolve();
        }
      },
    },
  },
};
