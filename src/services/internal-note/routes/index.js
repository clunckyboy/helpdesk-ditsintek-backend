import { Router } from "express";
import { createNote, getNotesByTicketId } from '../controller/internal-note-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { internalNotePayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/tickets/:id/notes', validate(internalNotePayloadSchema), createNote);
router.get('/tickets/:id/notes', getNotesByTicketId);


export default router;