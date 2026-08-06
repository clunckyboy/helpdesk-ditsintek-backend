import response from '../../utils/response.js';
import TicketDraftRepositories from './ticket-draft-repositories.js';

const draftTimers = new Map();

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

    // TIMER
    if (!draftTimers.has(chatId)) {
      // Nyalakan timer hitung mundur
      const globalTimer = setTimeout(async () => {
        try {
          // Saat batas waktu habis, hapus draft dari database
          await TicketDraftRepositories.deleteDraft(chatId);
          draftTimers.delete(chatId);
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          const messageText = `Waktu anda habis. Silakan buat tiket baru`;

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: messageText,
            })
          });
        } catch (err) {
          console.error("Gagal menghapus draft saat timeout:", err);
        }
      }, 15 * 60 * 1000);

      draftTimers.set(chatId, globalTimer);
    }

    return response(res, 200, 'Draft berhasil diperbarui', draft);
  } catch (error) {
    next(error);
  }
};

export const deleteDraft = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (draftTimers.has(chatId)) {
      clearTimeout(draftTimers.get(chatId));
      draftTimers.delete(chatId);
    }

    const deleted = await TicketDraftRepositories.deleteDraft(chatId);

    if (!deleted) {
      return response(res, 404, 'Draft tidak ditemukan untuk dihapus');
    }

    return response(res, 200, 'Draft berhasil dihapus');
  } catch (error) {
    next(error);
  }
};