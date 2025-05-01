import { Router } from "express";
import { checkSchema } from "express-validator";
import { createRestaurant, deleteRestaurant, getRestaurantById, getRestaurants } from "../controllers/restaurants.js";
import validateJwtCookie from "../middlewares/auth.js";
import { createRestaurantValidation, deleteRestaurantValidation, getRestaurantByIdValidation } from "../validations/restaurants.js";

const restaurantsRouter = Router();

restaurantsRouter.use(validateJwtCookie);
restaurantsRouter.post("/", checkSchema(createRestaurantValidation), createRestaurant);
restaurantsRouter.get("/", getRestaurants);
restaurantsRouter.get("/:id", checkSchema(getRestaurantByIdValidation), getRestaurantById);
restaurantsRouter.delete("/:id", checkSchema(deleteRestaurantValidation), deleteRestaurant);

// restaurantsRouter.put("/:id", updateRestaurant);

export default restaurantsRouter;
