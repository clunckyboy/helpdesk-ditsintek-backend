import { Router } from 'express';
import users from '../services/user/routes/index.js';
import authentication from '../services/authentication/routes/index.js';
import tickets from '../services/ticket/routes/index.js';
import faqs from '../services/faq/routes/index.js';

const router = Router();

router.use('/api', users);
router.use('/api', authentication);
router.use('/api', tickets);
router.use('/api', faqs);

export default router;