import prisma from "../utils/prisma.js";

export const signupValidation = {
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    custom: {
      options: async (value) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return Promise.reject("Please enter a valid email");
        } else {
          const exists = await prisma.user.findUnique({
            where: {
              email: value
            }
          })
          if (exists) {
            return Promise.reject("Email already exists");
          }
          return Promise.resolve();
        }
      },
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
  },
  firstName: {
    notEmpty: {
      errorMessage: "First name is required",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "First name must be at least 2 characters long",
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: "Last name is required",
    },
    isLength: {
      options: { min: 2 },
      errorMessage: "Last name must be at least 2 characters long",
    },
  },
};

export const loginValidation = {
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    custom: {
      options: async (value, {req}) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return Promise.reject("Please enter a valid email");
        } else {
          const exists = await prisma.user.findUnique({
            where: {
              email: value
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              password: true,
            }
          })
          if (!exists) {
            return Promise.reject("Email does not exist");
          }
          req.user = exists;
          return Promise.resolve();
        }
      },
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
};
