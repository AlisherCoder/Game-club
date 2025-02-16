import {
   create,
   getAll,
   update,
   getOne,
   getBySearch,
} from "../controllers/order.controller.js";
import { Router } from "express";
import verifyToken from "../middlewares/verifyToken.js";
import rolePolice from "../middlewares/rolePolice.js";

const orderRoute = Router();

orderRoute.get("/search", verifyToken, rolePolice(["admin"]), getBySearch);
orderRoute.get("/", verifyToken, rolePolice(["admin"]), getAll);
orderRoute.get("/:id", verifyToken,  getOne);
orderRoute.post("/", verifyToken, create);
orderRoute.patch("/:id", verifyToken, rolePolice(["admin"]), update);

export default orderRoute;
