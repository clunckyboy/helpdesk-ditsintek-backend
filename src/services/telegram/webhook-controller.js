import response from '../../utils/response.js';
import TicketRepositories from '../ticket/repositories/ticket-repositories.js';
import TicketMessageRepositories from '../ticket-message/repositories/ticket-message-repositories.js';

// API 1: Menerima Pesan Webhook dari n8n
export const handleTelegramWebhook = async (req, res, next) => {
  try {
    const { 
      telegram_chat_id, 
      reporter, 
      reporter_role, 
      nim_nip, 
      description, 
      category 
    } = req.body;

    // Validasi dasar agar backend tidak crash
    if (!telegram_chat_id || !description) {
      return response(res, 400, 'Data tidak lengkap. telegram_chat_id dan description wajib diisi.');
    }

    // 1. Cek apakah mahasiswa memiliki tiket yang masih aktif (open, in_progress, resolved)
    let activeTicket = await TicketRepositories.getOpenTicketByTelegramId(telegram_chat_id);

    // 2. Jika tidak ada tiket aktif, sistem akan MEMBUAT TIKET BARU
    if (!activeTicket) {
      // Pastikan payload memiliki kategori sebelum membuat tiket baru
      if (!category) {
        return response(res, 400, 'Kategori laporan wajib diisi untuk membuat tiket baru.');
      }

      activeTicket = await TicketRepositories.createTicket({
        telegram_chat_id,
        reporter: reporter || 'Mahasiswa (Unknown)',
        reporter_role: reporter_role || null,
        nim_nip: nim_nip || null,
        category,
        description,
        status: 'open'
      });
    }

    // 3. Simpan isi teks mahasiswa ke dalam riwayat obrolan tiket (ticket_message)
    await TicketMessageRepositories.createMessage({
      id_ticket: activeTicket.id_ticket,
      id_user: null, // Null karena pengirimnya bukan staf IT
      sender_type: 'mahasiswa',
      message_text: description
    });

    // Selalu kembalikan respons 200 OK dengan cepat agar n8n tidak error timeout
    return response(res, 200, 'Webhook berhasil diproses', {
      ticket_id: activeTicket.id_ticket
    });

  } catch (error) {
    console.error("Error pada Webhook Telegram:", error);
    next(error);
  }
};

// API 2: Pengecekan Status Bot/Human untuk n8n
export const checkTelegramUserStatus = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const activeTicket = await TicketRepositories.getOpenTicketByTelegramId(chatId);

    if (activeTicket) {
      return response(res, 200, 'Status pengguna', { 
        status: 'human', 
        ticket_id: activeTicket.id_ticket 
      });
    }

    return response(res, 200, 'Status pengguna', { 
      status: 'bot' 
    });

  } catch (error) {
    next(error);
  }
};