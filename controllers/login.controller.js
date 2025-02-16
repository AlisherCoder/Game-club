import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
config();

let key = process.env.JWTSECRETKEY;

export async function login(req, res) {
   try {
      let { password, phone } = req.body;
      let user = await User.findOne({ where: { phone } });

      if (!user) {
         return res.status(404).json({ message: "Not found user" });
      }

      if (!user.isActive) {
         return res.status(401).json({
            message: "Your account is not active, please activate it",
         });
      }

      let isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
         return res.status(401).json({ message: "Password or phone wrong" });
      }

      let token = jwt.sign(
         {
            id: user.id,
            isActive: user.isActive,
            role: user.role,
         },
         key
      );

      res.status(200).json({ message: "Logged in successfully", token });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
