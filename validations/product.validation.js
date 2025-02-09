import Joi from "joi";

const ProductPostValid = Joi.object({
   compNumber: Joi.number().positive().required(),
   price: Joi.number().positive().required(),
   compType: Joi.string().required(),
   status: Joi.boolean().required(),
   description: Joi.string().required(),
});

const ProductPatchValid = Joi.object({
   compNumber: Joi.number().positive(),
   price: Joi.number().positive(),
   compType: Joi.string(),
   status: Joi.boolean(),
   description: Joi.string(),
});

export { ProductPatchValid, ProductPostValid };
