import {
   resetPassword,
   sendOtpAgain,
} from "../controllers/reset.controller.js";
import { register, verify } from "../controllers/register.controller.js";
import {
   getAll,
   getBySearch,
   getOne,
   remove,
   update,
} from "../controllers/user.controller.js";
import { login } from "../controllers/login.controller.js";
import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import rolePolice from "../middlewares/rolePolice.js";
import selfPolice from "../middlewares/selfPolice.js";

const userRoute = Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/verify/:otp/:phone", verify);
userRoute.get("/send-otp/:phone", sendOtpAgain);
userRoute.patch("/reset-password/:otp/:phone", resetPassword);

userRoute.get("/search", verifyToken, rolePolice(["admin"]), getBySearch);
userRoute.get("/", verifyToken, rolePolice(["admin"]), getAll);
userRoute.get("/:id", verifyToken, rolePolice(["admin"]), getOne);
userRoute.delete("/:id", verifyToken, selfPolice(["admin"]), remove);
userRoute.patch("/:id", verifyToken, selfPolice(["admin"]), update);

export default userRoute;
