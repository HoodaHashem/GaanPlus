import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import 'dotenv/config';
import customError from "../utils/customError.js";

export const signup = asyncHandler(async(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, firstName, lastName, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 12);
  const user = {
    email,
    firstName,
    lastName,
    password: hashedPassword,
  };

  const userData = await prisma.user.create({
    data: user,
  });
  if (!userData) {
    return res.status(500).json({
      message: "Error creating user",
    });
  }
  // Generate a JWT token
  const token = jwt.sign(
    { id: userData.id, email: userData.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000}
  );

  // set the token in a cookie
  // to be used for authentication
  // in subsequent requests
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });


  return res.status(201).json({
    message: "User created successfully",
    data: {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      token,
    },
  });
})

export const login = asyncHandler(async(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { password } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  // Generate a JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000}
  );

  // Remove the password from the user object
  // to avoid sending it in the response
  // and set the token in a cookie
  // to be used for authentication
  // in subsequent requests
  const { password: _, ...userData } = user;
  res.cookie("token", token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Login successful",
    data: {
      ...userData,
      token,
    },
  });
})

export const logout = asyncHandler(async(req, res) => {
  // Clear the cookie
  res.clearCookie("token");
  return res.status(200).json({
    message: "Logout successful",
  });
})

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(200).json({
          status: "fail",
          message: "User is not logged in",
        });
      }
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      if (!user) {
        return next(new customError("User does not exist", 401));
      }
      res.status(200).json({
        status: "success",
        message: "User is logged in",
        data: user,
      });
    });
  } else {
    return next(new customError("Please login to get access", 401));
  }
});
