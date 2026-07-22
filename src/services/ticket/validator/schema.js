import Joi from 'joi';

const ticketStatus = ['open', 'in_progress', 'resolved', 'closed'];

export const createTicketPayloadSchema = Joi.object({
  telegram_chat_id: Joi.string().max(100).required(),
  reporter: Joi.string().max(50).required(),
  reporter_role: Joi.string().max(30).optional(),
  nim_nip: Joi.string().max(50).optional(),
  description: Joi.string().required(),
  category: Joi.string().max(50).required(),
  status: Joi.string().valid(...ticketStatus).default('open'),
  assigned_to: Joi.string().max(25).optional(),
});

export const updateTicketStatusPayloadSchema = Joi.object({
  status: Joi.string().valid(...ticketStatus).optional(),
  assigned_to: Joi.string().max(25).allow(null).optional(),
}).or('status', 'assigned_to');
