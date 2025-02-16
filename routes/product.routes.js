import {
   create,
   getAll,
   getBySearch,
   getOne,
   remove,
   update,
} from "../controllers/product.controller.js";
import { Router } from "express";
import upload from "../middlewares/multer.js";
import verifyToken from "../middlewares/verifyToken.js";
import rolePolice from "../middlewares/rolePolice.js";

const productRoute = Router();

productRoute.get("/search", getBySearch);
productRoute.get("/", getAll);
productRoute.get("/:id", getOne);
productRoute.post(
   "/",
   verifyToken,
   rolePolice(["admin"]),
   upload.single("image"),
   create
);
productRoute.delete("/:id", verifyToken, rolePolice(["admin"]), remove);
productRoute.patch(
   "/:id",
   verifyToken,
   rolePolice(["admin"]),
   upload.single("image"),
   update
);

export default productRoute;
