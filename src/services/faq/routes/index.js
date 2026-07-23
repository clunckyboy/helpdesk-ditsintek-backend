import { Router } from 'express';
import { createFaq, searchFaqs, getFaqById, getAllFaqs } from '../controller/faq-controller.js';

const router = Router();

router.post('/faqs', createFaq);
router.get('/faqs/search', searchFaqs);
router.get('/faqs/:id', getFaqById);
router.get('/faqs', getAllFaqs);

export default router;
