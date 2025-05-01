import { Router } from "express";
import { checkSchema } from "express-validator";
import validateJwtCookie from "../middlewares/auth.js";
import { cancelOrder, completeOrder, createOrder, deliverOrder, getOrderById, getOrderItems, getOrders, prepareOrder } from "../controllers/orders.js";
import { createOrderValidation, getOrderByIdValidation } from "../validations/orders.js";

const ordersRouter = Router();
ordersRouter.use(validateJwtCookie)

ordersRouter.get("/:id",checkSchema(getOrderByIdValidation), getOrderById);
ordersRouter.post("/",checkSchema(createOrderValidation), createOrder);
ordersRouter.get("/items/:id", getOrderItems);
ordersRouter.get("/", getOrders);

ordersRouter.get("/cancel/:id",checkSchema(getOrderByIdValidation), cancelOrder); 
ordersRouter.get("/prepare/:id",checkSchema(getOrderByIdValidation), prepareOrder);
ordersRouter.get("/deliver/:id",checkSchema(getOrderByIdValidation), deliverOrder);
ordersRouter.get("/complete/:id",checkSchema(getOrderByIdValidation), completeOrder);

export default ordersRouter;
