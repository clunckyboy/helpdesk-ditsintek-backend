import { Router } from "express";
import { createMessage, getMessagesByTicketId } from '../controller/ticket-message-controller.js';
import { validate } from "../../../middlewares/validate.js";
import { ticketMessagePayloadSchema } from "../validator/schema.js";

const router = Router();

router.post('/tickets/:id/messages', validate(ticketMessagePayloadSchema), createMessage);
router.get('/tickets/:id/messages', getMessagesByTicketId);

export default router;