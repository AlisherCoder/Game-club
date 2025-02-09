import {
   create,
   getAll,
   getOne,
   remove,
   update,
} from "../controllers/product.controller.js";
import { Router } from "express";
import upload from "../middlewares/multer.js";

const productRoute = Router();

productRoute.get("/", getAll);
productRoute.post("/", upload.single("image"), create);
productRoute.get("/:id", getOne);
productRoute.delete("/:id", remove);
productRoute.patch("/:id", upload.single("image"), update);

export default productRoute;
