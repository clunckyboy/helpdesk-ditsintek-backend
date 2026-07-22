import Joi from 'joi';

export const internalNotePayloadSchema = Joi.object({
  id_user: Joi.string().required(),
  note_text: Joi.string().required()
})