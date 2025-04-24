import { Router } from "express";
import getHealth from "../controllers/health.js";

const healthRouter = Router()

healthRouter.get("/", getHealth)

export default healthRouter;
