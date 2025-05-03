import { Router } from "express";
import { checkSchema } from "express-validator";
import validateJwtCookie from "../middlewares/auth.js";
import { cancelOrder, completeOrder, createOrder, deliverOrder, getOrderById, getOrderItems, getOrders, prepareOrder, rejectOrder } from "../controllers/orders.js";
import { cancelOrderValidation, completeOrderValidation, createOrderValidation, deliverOrderValidation, getOrderByIdValidation, prepareOrderValidation, rejectOrderValidation } from "../validations/orders.js";

const ordersRouter = Router();
ordersRouter.use(validateJwtCookie)

ordersRouter.get("/:id",checkSchema(getOrderByIdValidation), getOrderById);
ordersRouter.post("/",checkSchema(createOrderValidation), createOrder);
ordersRouter.get("/items/:id", getOrderItems);
ordersRouter.get("/", getOrders);

ordersRouter.get("/cancel/:id",checkSchema(cancelOrderValidation), cancelOrder); 
ordersRouter.get("/prepare/:id",checkSchema(prepareOrderValidation), prepareOrder);
ordersRouter.get("/deliver/:id",checkSchema(deliverOrderValidation), deliverOrder);
ordersRouter.get("/complete/:id",checkSchema(completeOrderValidation), completeOrder);
ordersRouter.get("/reject/:id",checkSchema(rejectOrderValidation), rejectOrder);
export default ordersRouter;
