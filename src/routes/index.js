import { Router } from 'express';
import users from '../services/user/routes/index.js';
import authentication from '../services/authentication/routes/index.js';
import tickets from '../services/ticket/routes/index.js';
import faqs from '../services/faq/routes/index.js';
import ticket_message from '../services/ticket-message/routes/index.js';
import internal_note from '../services/internal-note/routes/index.js';
import telegram from '../services/telegram/routes.js';

const router = Router();

router.use('/api', users);
router.use('/api', authentication);
router.use('/api', tickets);
router.use('/api', faqs);
router.use('/api', ticket_message);
router.use('/api', internal_note);
router.use('/api', telegram);

export default router;