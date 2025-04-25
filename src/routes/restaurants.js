import { Router } from "express";
import { checkSchema } from "express-validator";
import { createRestaurant, deleteRestaurant, getRestaurantById, getRestaurants } from "../controllers/restaurants.js";
import validateJwtCookie from "../middlewares/auth.js";
import { createRestaurantValidation } from "../validations/restaurants.js";

const restaurantsRouter = Router();

restaurantsRouter.use(validateJwtCookie);
restaurantsRouter.post("/", checkSchema(createRestaurantValidation), createRestaurant);
restaurantsRouter.get("/", getRestaurants);
restaurantsRouter.get("/:id", getRestaurantById);
restaurantsRouter.delete("/:id", deleteRestaurant);

// restaurantsRouter.put("/:id", updateRestaurant);

export default restaurantsRouter;
