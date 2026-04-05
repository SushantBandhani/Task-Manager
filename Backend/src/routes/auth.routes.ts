import { Router } from "express";
import {
  login,
  logout,
  refreshAccessToken,
  registerUser,
  getUserData
} from "../controllers/auth.controller.ts";
import verifyJWT from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";
import registerUserSchema from "../validators/registerUser.validator.ts";
import loginUserSchema from "../validators/loginUser.validator.ts";

const authRouter = Router();

authRouter.post("/register", validate(registerUserSchema), registerUser);
authRouter.post("/login", validate(loginUserSchema), login);
authRouter.post("/refreshToken", refreshAccessToken);

authRouter.post("/logout", verifyJWT, logout);
authRouter.get("/user", verifyJWT, getUserData);

export default authRouter;
