import { Router } from "express";
import { createMessage } from '../controller/ticket-message-controller.js';
import { validate } from "../../../middlewares/validate.js";
import { ticketMessagePayloadSchema } from "../validator/schema.js";

const router = Router();

router.post('/tickets/:id/messages', validate(ticketMessagePayloadSchema), createMessage);

export default router;