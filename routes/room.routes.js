import {
   create,
   getAll,
   getOne,
   remove,
   update,
} from "../controllers/room.controller.js";
import { Router } from "express";
import upload from "../middlewares/multer.js";

const roomRoute = Router();

roomRoute.get("/", getAll);
roomRoute.post("/", upload.single("image"), create);
roomRoute.get("/:id", getOne);
roomRoute.delete("/:id", remove);
roomRoute.patch("/:id", upload.single("image"), update);

export default roomRoute;
