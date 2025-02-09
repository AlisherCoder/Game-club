import bcrypt from "bcrypt";
import db from "../config/db.js";
import { totp } from "otplib";
import { config } from "dotenv";
import { PhoneValid } from "../validations/user.validation.js";
config();

totp.options = { step: 300, digits: 5 };
let otpSecret = process.env.OTPSECRET;

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

export async function getOtpForReset(req, res) {
   try {
      let { phone } = req.params;

      if (!PhoneValid(phone)) {
         return res.status(422).json({ message: "Phone format is incorrect" });
      }

      let [user] = await db.execute("select * from users where phone = ?", [
         phone,
      ]);

      if (!user.length) {
         return res.status(404).json({ message: "Not found user" });
      }

      let otp = await sendOTP(phone);

      res.status(200).json({ message: "OTP sent, check your phone", otp });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}

export async function resetPassword(req, res) {
   try {
      let { phone, otp } = req.params;
      let { newPassword } = req.body;

      let key = otpSecret + phone;
      let isValid = totp.check(otp, key);

      if (!isValid) {
         return res.status(400).json({ message: "Invalid OTP" });
      }

      let hashpass = bcrypt.hashSync(newPassword, 10);
      await db.execute(
         "update users set password = ? where phone = ?",
         [hashpass, phone]
      );

      res.status(200).json({ message: "Password reset successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
