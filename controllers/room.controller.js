import Room from "../models/room.model.js";
import path from "path";
import fs from "fs";
import {
   RoomPatchValid,
   RoomPostValid,
} from "../validations/room.validation.js";
import { roomSearchValid } from "../validations/search.valid.js";

export async function getAll(req, res) {
   try {
      let data = await Room.findAll();

      if (!data.length) {
         return res.status(200).json({ message: "No rooms yet" });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function create(req, res) {
   try {
      let { error, value } = RoomPostValid.validate(req.body);
      if (error) {
         try {
            fs.unlinkSync(req.file.path);
         } catch (error) {}
         return res.status(422).json({ message: error.details[0].message });
      }

      if (!req.file) {
         return res.status(422).json({ message: "The room photo must be" });
      }

      value.image = req.file.filename;
      let created = await Room.create(value);

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
      let found = await Room.findByPk(id);

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
      let found = await Room.findByPk(id);

      if (!found) {
         return res.status(404).json({ message: "Not found data" });
      }

      await found.destroy();
      try {
         let pathfile = path.join("uploads", found.image);
         fs.unlinkSync(pathfile);
      } catch (error) {}

      res.status(200).json({ message: "room deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   try {
      let { id } = req.params;
      let { error, value } = RoomPatchValid.validate(req.body);
      if (error) {
         try {
            fs.unlinkSync(req.file.path);
         } catch (error) {}
         return res.status(422).json({ message: error.details[0].message });
      }

      let found = await Room.findByPk(id);
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

      let { error, value } = roomSearchValid.validate(query);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let rooms = await Room.findAll({ where: value });
      if (!rooms.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data: rooms });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
