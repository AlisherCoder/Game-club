import {
   create,
   getAll,
   getBySearch,
   getOne,
   remove,
   update,
} from "../controllers/room.controller.js";
import { Router } from "express";
import upload from "../middlewares/multer.js";
import verifyToken from "../middlewares/verifyToken.js";
import rolePolice from "../middlewares/rolePolice.js";

const roomRoute = Router();

roomRoute.get("/search", getBySearch);
roomRoute.get("/", getAll);
roomRoute.get("/:id", getOne);
roomRoute.post(
   "/",
   verifyToken,
   rolePolice(["admin"]),
   upload.single("image"),
   create
);
roomRoute.delete("/:id", verifyToken, rolePolice(["admin"]), remove);
roomRoute.patch(
   "/:id",
   verifyToken,
   rolePolice(["admin"]),
   upload.single("image"),
   update
);

export default roomRoute;
