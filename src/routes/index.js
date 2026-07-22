import { Router } from 'express';
import users from '../services/user/routes/index.js';
import authentication from '../services/authentication/routes/index.js';

const router = Router();

router.use('/', users);
router.use('/', authentication);

export default router;