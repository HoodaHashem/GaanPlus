import { Router } from "express";
import prisma from "../utils/prisma.js";

const adminRouter = Router();

adminRouter.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

adminRouter.delete("/users", async (req, res) => {
  await prisma.user.deleteMany();
  res.status(200).json({
    status: "success",
    message: "All users deleted",
  });
});

export default adminRouter;
