import Product from "../models/product.model.js";
import path from "path";
import fs from "fs";
import {
   ProductPatchValid,
   ProductPostValid,
} from "../validations/product.validation.js";
import { productSearchValid } from "../validations/search.valid.js";

export async function getAll(req, res) {
   try {
      let data = await Product.findAll();

      if (!data.length) {
         return res.status(200).json({ message: "No products yet" });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function create(req, res) {
   try {
      let { error, value } = ProductPostValid.validate(req.body);
      if (error) {
         try {
            fs.unlinkSync(req.file.path);
         } catch (error) {}
         return res.status(422).json({ message: error.details[0].message });
      }

      if (!req.file) {
         return res.status(422).json({ message: "The product photo must be" });
      }

      value.image = req.file.filename;
      let created = await Product.create(value);

      res.status(201).json({ data: created });
   } catch (error) {
      try {
         fs.unlinkSync(req.file.path);
      } catch (error) {}
      res.status(500).json({ message: error.message });
   }
}

export async function getOne(req, res) {
   try {
      let { id } = req.params;
      let found = await Product.findByPk(id);

      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: found });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   try {
      let { id } = req.params;
      let found = await Product.findByPk(id);

      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      await found.destroy();
      try {
         let pathfile = path.join("uploads", found.image);
         fs.unlinkSync(pathfile);
      } catch (error) {}

      res.status(200).json({ message: "Product deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   try {
      let { id } = req.params;
      let { error, value } = ProductPatchValid.validate(req.body);
      if (error) {
         try {
            fs.unlinkSync(req.file.path);
         } catch (error) {}
         return res.status(422).json({ message: error.details[0].message });
      }

      let found = await Product.findByPk(id);
      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      if (req.file) {
         value.image = req.file.filename;
         try {
            let pathfile = path.join("uploads", found.image);
            fs.unlinkSync(pathfile);
         } catch (error) {}
      }

      await found.update(value);

      res.status(200).json({ data: found });
   } catch (error) {
      try {
         fs.unlinkSync(req.file.path);
      } catch (error) {}
      res.status(500).json({ message: error.message });
   }
}

export async function getBySearch(req, res) {
   try {
      let query = {};
      for (let [key, val] of Object.entries(req.query)) {
         if (val) {
            query[key] = val;
         }
      }

      let { error, value } = productSearchValid.validate(query);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let products = await Product.findAll({ where: value });
      if (!products.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: products });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
