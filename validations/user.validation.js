import Joi from "joi";

const RegisterValid = Joi.object({
   name: Joi.string()
      .max(20)
      .min(2)
      .pattern(/^[a-zA-Zа-яА-Я]+$/)
      .required(),
   phone: Joi.string().required(),
   password: Joi.string()
      .min(5)
      .pattern(/^[a-zA-Z0-9.]+$/)
      .required(),
});

const UserPatchValid = Joi.object({
   name: Joi.string()
      .max(20)
      .min(2)
      .pattern(/^[a-zA-Zа-яА-Я]+$/),
   role: Joi.string(),
   isActive: Joi.boolean(),
});

const UserNewPassword = Joi.object({
   newPassword: Joi.string()
      .min(5)
      .pattern(/^[a-zA-Z0-9.]+$/)
      .required(),
});

function PhoneValid(phoneNumber) {
   const phoneRegex = /^\+998\d{9}$/;
   if (phoneRegex.test(phoneNumber)) {
      return true;
   }
   return false;
}

export { RegisterValid, PhoneValid, UserPatchValid, UserNewPassword };
