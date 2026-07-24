import Joi from 'joi';

export const ticketMessagePayloadSchema = Joi.object({
  id_user: Joi.string().allow(null, '').optional(),
  sender_type: Joi.string().required(),
  message_text: Joi.string().required()
});