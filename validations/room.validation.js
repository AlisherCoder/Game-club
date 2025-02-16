import Joi from "joi";

const RoomPostValid = Joi.object({
   roomNumber: Joi.number().positive().required(),
   price: Joi.number().positive().required(),
   countComps: Joi.number().positive().required(),
   description: Joi.string().required(),
});

const RoomPatchValid = Joi.object({
   roomNumber: Joi.number().positive(),
   price: Joi.number().positive(),
   countComps: Joi.number().positive(),
   description: Joi.string(),
   status: Joi.boolean(),
});

export { RoomPatchValid, RoomPostValid };
