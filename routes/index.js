import userRoute from "./user.routes.js";

import { Router } from "express";

const mainRoute = Router();

mainRoute.use("/users", userRoute);

export default mainRoute;
