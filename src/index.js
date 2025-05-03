import express from "express";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import globalErrors from "./middlewares/globalErrors.js";
import { loggerMiddleware } from "./middlewares/logger.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import "dotenv/config";
import usersRouter from "./routes/users.js";
import restaurantsRouter from "./routes/restaurants.js";
import menusRouter from "./routes/menuItems.js";
import ordersRouter from "./routes/orders.js";

const app = express();

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(loggerMiddleware);

// this route is for development purposes only
// its purpose is to help developers test the api
//! Note: this route should be removed in production
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/restaurants", restaurantsRouter);
app.use("/api/v1/menu-items", menusRouter);
app.use("/api/v1/orders", ordersRouter);

app.use(globalErrors);

app.listen(PORT, (err) => {
  if (err) console.log("Error starting the server");
  else console.log("Listening on =>", PORT);
});
