import joi from "joi";

const userSearchValid = joi.object({
   name: joi.string(),
   phone: joi.string(),
   role: joi.string(),
   isActive: joi.boolean(),
});

const productSearchValid = joi.object({
   compNumber: joi.number().positive(),
   price: joi.number().positive(),
   compType: joi.string(),
   status: joi.boolean(),
});

const roomSearchValid = joi.object({
   roomNumber: joi.number().positive(),
   price: joi.number().positive(),
   countComps: joi.number().positive(),
   status: joi.boolean(),
});

const orderSearchValid = joi.object({
   userId: joi.number().positive(),
   totalSum: joi.number().positive(),
   payment: joi.string(),
   payStatus: joi.string(),
});

export {
   userSearchValid,
   productSearchValid,
   roomSearchValid,
   orderSearchValid,
};
