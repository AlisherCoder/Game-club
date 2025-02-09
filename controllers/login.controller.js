import db from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

let key = process.env.JWTSECRETKEY;

export async function login(req, res) {
   try {
      let { password, phone } = req.body;
      let [user] = await db.execute("select * from users where phone = ?", [
         phone,
      ]);

      if (!user.length) {
         return res.status(404).json({ message: "Not found user" });
      }

      if (!user[0].isActive) {
         return res.status(401).json({
            message: "Your account is not active, please activate it",
         });
      }

      let isValid = bcrypt.compareSync(password, user[0].password);
      if (!isValid) {
         return res.status(401).json({ message: "Password or phone wrong" });
      }

      let token = jwt.sign(
         {
            phone: user[0].phone,
            isActive: user[0].isActive,
            role: user[0].role,
         },
         key
      );

      res.status(200).json({ message: "Logged in successfully", token });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
