import { Router } from "express";
import { checkSchema } from "express-validator";
import { createMenuItemValidation, deleteMenuItemValidation, getMenuItemByIdValidation, getRestaurantMenuItemsValidation } from "../validations/menuItems.js";
import { createMenuItem, deleteMenuItem, getMenuItemById, getRestaurantMenuItems } from "../controllers/menuItems.js";
import validateJwtCookie from "../middlewares/auth.js";

const menusRouter = Router();

menusRouter.use(validateJwtCookie);
menusRouter.post("/", checkSchema(createMenuItemValidation), createMenuItem);
menusRouter.get("/", checkSchema(getRestaurantMenuItemsValidation), getRestaurantMenuItems);
menusRouter.get("/:id", checkSchema(getMenuItemByIdValidation), getMenuItemById);
menusRouter.delete("/:id",checkSchema(deleteMenuItemValidation), deleteMenuItem);
// menusRouter.put("/:id", updateMenuItem);

export default menusRouter;
