import { Router } from "express";
import { createNote } from '../controller/internal-note-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { internalNotePayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/tickets/:id/notes', validate(internalNotePayloadSchema), createNote);

export default router;