import { Router } from 'express';
import { createFaq, searchFaqs, getFaqById, getAllFaqs, updateFaqById, deleteFaqById } from '../controller/faq-controller.js';
import { validate } from '../../../middlewares/validate.js';
import { createFaqPayloadSchema, updateFaqPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/faqs', validate(createFaqPayloadSchema), createFaq);
router.put('/faqs/:id', validate(updateFaqPayloadSchema), updateFaqById);
router.delete('/faqs/:id', deleteFaqById);
router.get('/faqs/search', searchFaqs);
router.get('/faqs/:id', getFaqById);
router.get('/faqs', getAllFaqs);

export default router;
