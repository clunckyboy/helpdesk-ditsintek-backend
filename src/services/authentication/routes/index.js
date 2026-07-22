import { Router } from 'express';
import { postAuthenticationPayloadSchema, tokenPayloadSchema } from '../validator/schema.js';
import { login, refreshToken, logout } from '../controller/authentication-controller.js';
import { validate } from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';

const router = Router();

router.post('/authentications', validate(postAuthenticationPayloadSchema), login);
router.put('/authentications', validate(tokenPayloadSchema), refreshToken);
router.delete('/authentications', authenticateToken, validate(tokenPayloadSchema), logout);

export default router;