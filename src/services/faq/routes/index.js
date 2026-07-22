import { Router } from 'express';
import { searchFaqs, getFaqById, getAllFaqs } from '../controller/faq-controller.js';

const router = Router();

router.get('/faqs/search', searchFaqs);
router.get('/faqs/:id', getFaqById);
router.get('/faqs', getAllFaqs);

export default router;
