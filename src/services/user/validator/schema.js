import Joi from "joi";

export const userPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  username: Joi.string().max(50).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const updateUserPayloadSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  username: Joi.string().max(50),
  password: Joi.string().min(6),
  role: Joi.string(),
});