import { Router } from "express";
import { getDraft, upsertDraft, deleteDraft } from "./ticket-draft-controller.js";

const router = Router();

router.get('/drafts/:chatId', getDraft);
router.put('/drafts/:chatId', upsertDraft);
router.delete('/drafts/:chatId', deleteDraft);

export default router;