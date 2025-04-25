import { Router } from "express";
import { checkSchema } from "express-validator";
import { loginValidation, signupValidation } from "../validations/auth.js";
import { login, signup } from "../controllers/auth.js";

const authRouter = Router()

authRouter.post("/signup", checkSchema(signupValidation), signup)
authRouter.post("/login", checkSchema(loginValidation), login)
// authRouter.post("/logout", logout)
// authRouter.post("/refresh-token", refreshToken)
// authRouter.post("/forgot-password", forgotPassword)
// authRouter.post("/reset-password", resetPassword)
// authRouter.post("/verify-email", verifyEmail)

export default authRouter
