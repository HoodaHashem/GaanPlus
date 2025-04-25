import { Router } from "express";
import { checkSchema } from "express-validator";
import { createMenuItemValidation, getRestaurantMenuItemsValidation } from "../validations/menuItems.js";
import { createMenuItem } from "../controllers/menuItems.js";

const menusRouter = Router();

menusRouter.post("/", checkSchema(createMenuItemValidation), createMenuItem);
menusRouter.get("/", checkSchema(getRestaurantMenuItemsValidation), getRestaurantMenuItems);
menusRouter.get("/:id", getMenuItemById);
menusRouter.delete("/:id", deleteMenuItem);
// menusRouter.put("/:id", updateMenuItem);

export default menusRouter;
