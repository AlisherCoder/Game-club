import axios from "axios";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import { totp } from "otplib";
import { config } from "dotenv";
import { PhoneValid, RegisterValid } from "../validations/user.validation.js";
config();

totp.options = { step: 300, digits: 5 };
let otpSecret = process.env.OTPSECRETKEY;

let api = axios.create({
   baseURL: "https://notify.eskiz.uz/api",
   headers: {
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE2NzQwNzAsImlhdCI6MTczOTA4MjA3MCwicm9sZSI6InRlc3QiLCJzaWduIjoiNjg2YTcyYmIzYWEzYzk4NTIyZjFmODZjM2VlMmM0YzUzNjliZDFiMjgyOTY1ZGM1N2VhMDI1NTY5Y2JmNTEzMiIsInN1YiI6Ijk3MjkifQ.90phqiIsVhulSMsA-fjQUkoZaPIay83oED_sCI3Tyj4",
   },
});

async function sendOTP(phone) {
   try {
      let key = otpSecret + phone;
      let otp = totp.generate(key);

      //   await api.post("/message/sms/send", {
      //      mobile_phone: phone,
      //      message: "Bu Eskiz dan test",
      //      from: 4546,
      //   });

      return otp;
   } catch (error) {
      console.log(error.message);
   }
}

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

      let [user] = await db.execute("select * from users where phone = ?", [
         phone,
      ]);

      if (user.length) {
         return res.status(409).json({ message: "User already exists" });
      }

      let hashpass = bcrypt.hashSync(password, 10);
      let [created] = await db.execute(
         "insert into users(phone, name, password) values(?, ?, ?)",
         [phone, name, hashpass]
      );

      if (!created.affectedRows) {
         return res.status(400).send({ message: "Error try again" });
      }

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

      await db.execute("update users set isActive = true where phone = ?", [
         phone,
      ]);

      res.status(200).json({
         message: "The user has been successfully activated",
      });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function sendOtpAgain(req, res) {
   try {
      let { phone } = req.params;

      if (!PhoneValid(phone)) {
         return res.status(422).json({ message: "Phone format is incorrect" });
      }

      let otp = await sendOTP(phone);

      res.status(200).json({ message: "New code sent", otp });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
