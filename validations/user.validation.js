import Joi from "joi";

const RegisterValid = Joi.object({
   name: Joi.string().max(20).min(2).required(),
   phone: Joi.string().required(),
   password: Joi.string().min(5).required(),
});

const UserPatchValid = Joi.object({
   name: Joi.string().max(20).min(2),
   phone: Joi.string(),
   password: Joi.string().min(5),
   role: Joi.string(),
   isActive: Joi.boolean(),
});

function PhoneValid(phoneNumber) {
   const phoneRegex = /^\+998\d{9}$/;
   if (phoneRegex.test(phoneNumber)) {
      return true;
   }
   return false;
}

export { RegisterValid, PhoneValid, UserPatchValid };
