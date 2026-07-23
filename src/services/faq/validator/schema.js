import Joi from 'joi';

const embeddingSchema = Joi.array()
  .items(Joi.number())
  .length(768);

export const createFaqPayloadSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
  category: Joi.string().max(50).required(),
  embeddings: embeddingSchema.optional(),
});

export const searchFaqPayloadSchema = Joi.object({
  query: Joi.string().min(1).required(),
  category: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(20).default(5).optional(),
}).unknown(true);
