import db from "../config/db.js";
import { UserPatchValid } from "../validations/user.validation.js";

export async function getAll(req, res) {
   try {
      let [data] = await db.query("select * from users");

      if (!data.length) {
         return res.status(200).json({ message: "No users yet" });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function getOne(req, res) {
   try {
      let { id } = req.params;

      let [data] = await db.execute("select * from users where id = ?", [id]);
      if (!data.length) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ data });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function remove(req, res) {
   try {
      let { id } = req.params;

      let [data] = await db.query("delete from users where id = ?", [id]);
      if (!data.affectedRows) {
         return res.status(404).json({ message: "Not found data" });
      }

      res.status(200).json({ message: "User deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function update(req, res) {
   try {
      let { id } = req.params;
      let { error, value } = UserPatchValid.validate(req.body);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let { phone, role, password } = value;
      let keys = Object.keys(value);
      let values = Object.values(value);
      let queryKey = keys.map((key) => (key += " = ?"));

      let [updated] = await db.execute(
         `update users set ${queryKey.join(", ")} where id = ?`,
         [...values, id]
      );

      if (!updated.affectedRows) {
         return res.status(404).json({ message: "Not found data" });
      }

      let [found] = await db.execute("select * from users where id = ?", [id]);

      res.status(200).json({ data: found });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
