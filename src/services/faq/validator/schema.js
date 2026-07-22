import Joi from 'joi';

export const searchFaqPayloadSchema = Joi.object({
  query: Joi.string().min(1).required(),
  category: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(20).default(5).optional(),
}).unknown(true);
