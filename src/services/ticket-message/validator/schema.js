import Joi from 'joi';

export const ticketMessagePayloadSchema = Joi.object({
  id_user: Joi.string().required(),
  sender_type: Joi.string().required(),
  message_text: Joi.string().required()
});