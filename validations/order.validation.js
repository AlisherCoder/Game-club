import Joi from "joi";

const OrderValid = Joi.object({
   userId: Joi.number().positive().required(),
   totalSum: Joi.number().positive().required(),
   payment: Joi.string().required(),
   payStatus: Joi.string().required(),
   products: Joi.array().required(),
});

export { OrderValid };
