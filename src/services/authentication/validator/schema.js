import Joi from 'joi';

export const postAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const tokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});