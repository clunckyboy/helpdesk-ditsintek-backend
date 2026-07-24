import { Router } from 'express';
import { handleTelegramWebhook, checkTelegramUserStatus } from './webhook-controller.js';

const router = Router();

// Rute khusus Webhook n8n
router.post('/webhook/telegram', handleTelegramWebhook);
router.get('/webhook/status/:chatId', checkTelegramUserStatus);

export default router;