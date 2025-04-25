import { Router } from "express";
import validateJwtCookie from "../middlewares/auth.js";
import { getUserInfo } from "../controllers/users.js";

const usersRouter = Router()

usersRouter.use(validateJwtCookie)

usersRouter.get("/me", getUserInfo)


// usersRouter.get("/me/notifications", getUserNotifications)
// usersRouter.get("/me/notifications/:id", getUserNotificationById)
// usersRouter.post("/me/notifications/delete/:id", deleteNotification)
// usersRouter.post("/me/notifications/delete-all", deleteAllNotifications)

export default usersRouter
