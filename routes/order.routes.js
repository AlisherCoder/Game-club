import { create, getAll } from "../controllers/order.controller.js";
import { Router } from "express";

const orderRoute = Router();

orderRoute.get("/", getAll);
orderRoute.post("/", create);

export default orderRoute;
