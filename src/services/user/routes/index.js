import { Router } from 'express';
import { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } from '../controller/user-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { userPayloadSchema, updateUserPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/users', validate(userPayloadSchema), createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', validate(updateUserPayloadSchema), updateUserById);
router.delete('/users/:id', deleteUserById)

export default router;