import Joi from "joi";

const OrderValid = Joi.object({
   userId: Joi.number().positive().required(),
   totalSum: Joi.number().positive().required(),
   payment: Joi.string().required(),
   products: Joi.array().required(),
});

const OrderPatchValid = Joi.object({
   payStatus: Joi.string().required(),
});

export { OrderValid, OrderPatchValid };
