import User from "../models/user.model.js";
import sendOTP from "../middlewares/sendOTP.js";
import bcrypt from "bcrypt";
import { totp } from "otplib";
import { PhoneValid, UserNewPassword } from "../validations/user.validation.js";

export async function sendOtpAgain(req, res) {
   try {
      let { phone } = req.params;

      if (!PhoneValid(phone)) {
         return res.status(422).json({ message: "Phone format is incorrect" });
      }

      let user = await User.findOne({ where: { phone } });

      if (!user) {
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
      let otpSecret = process.env.OTPSECRET;

      let { error } = UserNewPassword.validate(req.body);
      if (error) {
         return res.status(422).json({ message: error.details[0].message });
      }

      let { phone, otp } = req.params;
      let { newPassword } = req.body;

      let key = otpSecret + phone;
      let isValid = totp.check(otp, key);

      if (!isValid) {
         return res.status(400).json({ message: "Invalid OTP" });
      }

      let hashpass = bcrypt.hashSync(newPassword, 10);
      await User.update({ password: hashpass }, { where: { phone } });

      res.status(200).json({ message: "Password reset successfully" });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
}
