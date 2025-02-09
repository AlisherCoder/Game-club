import {
   getOtpForReset,
   resetPassword,
} from "../controllers/reset.controller.js";
import {
   register,
   sendOtpAgain,
   verify,
} from "../controllers/register.controller.js";
import {
   getAll,
   getOne,
   remove,
   update,
} from "../controllers/user.controller.js";
import { login } from "../controllers/login.controller.js";
import { Router } from "express";

const userRoute = Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/verify/:otp/:phone", verify);
userRoute.get("/send-otp/:phone", sendOtpAgain);

userRoute.get("/otp-for-reset/:phone", getOtpForReset);
userRoute.patch("/reset-password/:otp/:phone", resetPassword);

userRoute.get("/", getAll);
userRoute.get("/:id", getOne);
userRoute.delete("/:id", remove);
userRoute.patch("/:id", update);

export default userRoute;
