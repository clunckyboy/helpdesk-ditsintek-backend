import response from '../../../utils/response.js';
import TicketDraftRepositories from '../repositories/ticket-draft-repositories.js';

export const getDraft = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const draft = await TicketDraftRepositories.getDraft(chatId);

    if (!draft) {
      // Kita kembalikan 200 OK dengan data null agar n8n tidak error
      return response(res, 200, 'Draft tidak ditemukan', null);
    }

    return response(res, 200, 'Draft berhasil diambil', draft);
  } catch (error) {
    next(error);
  }
};

export const upsertDraft = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const draftData = req.body;

    if (!draftData.step) {
      return response(res, 400, 'Properti step wajib diisi');
    }

    const draft = await TicketDraftRepositories.upsertDraft(chatId, draftData);
    return response(res, 200, 'Draft berhasil diperbarui', draft);
  } catch (error) {
    next(error);
  }
};

export const deleteDraft = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const deleted = await TicketDraftRepositories.deleteDraft(chatId);

    if (!deleted) {
      return response(res, 404, 'Draft tidak ditemukan untuk dihapus');
    }

    return response(res, 200, 'Draft berhasil dihapus');
  } catch (error) {
    next(error);
  }
};