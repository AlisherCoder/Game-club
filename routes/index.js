import productRoute from "./product.routes.js";
import orderRoute from "./order.routes.js";
import roomRoute from "./room.routes.js";
import userRoute from "./user.routes.js";
import { Router } from "express";

const mainRoute = Router();

mainRoute.use("/users", userRoute);
mainRoute.use("/rooms", roomRoute);
mainRoute.use("/orders", orderRoute);
mainRoute.use("/products", productRoute);

export default mainRoute;
