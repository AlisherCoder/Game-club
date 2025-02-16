import sendOTP from "../middlewares/sendOTP.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { totp } from "otplib";
import { config } from "dotenv";
import { PhoneValid, RegisterValid } from "../validations/user.validation.js";
config();

let otpSecret = process.env.OTPSECRETKEY;

export async function register(req, res) {
   try {
      let { phone, name, password } = req.body;
      let { error } = RegisterValid.validate(req.body);

      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      if (!PhoneValid(phone)) {
         return res.status(422).json({ message: "Phone format is incorrect" });
      }

      let user = await User.findOne({ where: { phone } });

      if (user) {
         return res.status(409).json({ message: "User already exists" });
      }

      let hashpass = bcrypt.hashSync(password, 10);
      let newUser = await User.create({ phone, name, password: hashpass });

      let otp = await sendOTP(phone);

      res.status(201).json({
         message:
            "Registration successful. Check your phone to activate your account",
         otp,
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function verify(req, res) {
   try {
      let { otp, phone } = req.params;

      let key = otpSecret + phone;
      let isValid = totp.check(otp, key);

      if (!isValid) {
         return res.status(400).json({ message: "Invalid OTP" });
      }

      await User.update({ isActive: true }, { where: { phone } });

      res.status(200).json({
         message: "The user has been successfully activated",
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
