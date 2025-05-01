import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";

export const signupValidation = {
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    custom: {
      options: async (value) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          throw new Error("Please enter a valid email");
        } else {
          const exists = await User.findOne({
            email: value,
          });
          if (exists) {
            throw new Error("Email already exists");
          }
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
      options: async (value, { req }) => {
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          throw new Error("Please enter a valid email");
        } else {
          const exists = await User.findOne({
            email: value,
          }).select("+password");
          if (!exists) {
            throw new Error("Email does not exist");
          }
          req.user = exists;
        }
      },
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    custom: {
      options: async (value, { req }) => {
        const user = req.user;
        if (!user) {
          throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(value, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }
      },
    }
  },
};
