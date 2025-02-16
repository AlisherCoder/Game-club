import axios from "axios";
import { totp } from "otplib";

totp.options = { step: 600, digits: 5 };

let api = axios.create({
   baseURL: "https://notify.eskiz.uz/api",
   headers: {
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDE2NzQwNzAsImlhdCI6MTczOTA4MjA3MCwicm9sZSI6InRlc3QiLCJzaWduIjoiNjg2YTcyYmIzYWEzYzk4NTIyZjFmODZjM2VlMmM0YzUzNjliZDFiMjgyOTY1ZGM1N2VhMDI1NTY5Y2JmNTEzMiIsInN1YiI6Ijk3MjkifQ.90phqiIsVhulSMsA-fjQUkoZaPIay83oED_sCI3Tyj4",
   },
});

async function sendOTP(phone) {
   try {
      let key = process.env.OTPSECRETKEY + phone;
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

export default sendOTP;
