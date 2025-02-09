import db from "../config/db.js";
import fs from "fs";
import {
   ProductPatchValid,
   ProductPostValid,
} from "../validations/product.validation.js";
import path from "path";

export async function getAll(req, res) {
   try {
      let [data] = await db.query("select * from product");

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

      let { compNumber, price, status, compType, description } = value;
      let [created] = await db.execute(
         "insert into product (compNumber,price,status,compType,description,image) values(?,?,?,?,?,?)",
         [compNumber, price, status, compType, description, req.file.filename]
      );

      let [found] = await db.execute("select * from product where id = ?", [
         created.insertId,
      ]);

      res.status(201).json({ data: found[0] });
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

      let [found] = await db.execute("select * from product where id = ?", [
         id,
      ]);
      if (!found.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: found[0] });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   try {
      let { id } = req.params;

      let [found] = await db.execute("select * from product where id = ?", [
         id,
      ]);
      if (!found.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      await db.execute("delete from product where id = ?", [id]);
      try {
         let pathfile = path.join("uploads", found[0].image);
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

      let [data] = await db.execute("select * from product where id = ?", [id]);
      if (!data.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      let keys = Object.keys(value);
      let values = Object.values(value);

      if (req.file) {
         keys.push("image");
         values.push(req.file.filename);
      }
      let queryKey = keys.map((key) => (key += " = ?"));

      let [updated] = await db.execute(
         `update product set ${queryKey.join(", ")} where id = ?`,
         [...values, id]
      );

      if (req.file && updated.affectedRows) {
         try {
            let pathfile = path.join("uploads", data[0].image);
            fs.unlinkSync(pathfile);
         } catch (error) {}
      }

      let [found] = await db.execute("select * from product where id = ?", [
         id,
      ]);

      res.status(200).json({ data: found[0] });
   } catch (error) {
      try {
         fs.unlinkSync(req.file.path);
      } catch (error) {}
      res.status(500).json({ message: error.message });
   }
}
