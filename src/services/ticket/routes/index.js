import { Router } from 'express';
import { createTicket, getAllTickets, getTicketById, updateTicketStatus } from '../controller/ticket-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { createTicketPayloadSchema, updateTicketStatusPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/tickets', validate(createTicketPayloadSchema), createTicket);
router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketById);
router.put('/tickets/:id/status', validate(updateTicketStatusPayloadSchema), updateTicketStatus);

export default router;
