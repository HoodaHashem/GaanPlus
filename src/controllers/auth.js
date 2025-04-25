import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import prisma from "../utils/prisma.js";

export const signup = async(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, firstName, lastName, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);
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
  return res.status(201).json({
    message: "User created successfully",
    data: userData.id,
  });
}

export const login = async(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
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
  const { password: _, ...userData } = user;
  return res.status(200).json({
    message: "Login successful",
    data: userData,
  });
}
