import pool from '../../utils/database.js';

class TicketDraftRepositories {
  constructor() {
    this.pool = pool;
  }

  // 1. Mengambil data draft saat ini
  async getDraft(telegram_chat_id) {
    const query = {
      text: 'SELECT * FROM ticket_draft WHERE telegram_chat_id = $1',
      values: [telegram_chat_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0] || null; // Kembalikan null jika belum ada draft
  }

  // 2. Membuat atau memperbarui draft (Upsert)
  async upsertDraft(chatId, payload) {
    const query = {
      text: `
        INSERT INTO ticket_draft (telegram_chat_id, step, temp_name, temp_role, temp_nim_nip, temp_description)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (telegram_chat_id) 
        DO UPDATE SET
          step = EXCLUDED.step,
          temp_name = COALESCE(EXCLUDED.temp_name, ticket_draft.temp_name),
          temp_role = COALESCE(EXCLUDED.temp_role, ticket_draft.temp_role),
          temp_nim_nip = COALESCE(EXCLUDED.temp_nim_nip, ticket_draft.temp_nim_nip),
          temp_description = COALESCE(EXCLUDED.temp_description, ticket_draft.temp_description),
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `,
      values: [
        chatId,
        payload.step,
        payload.temp_name || null,
        payload.temp_role || null,
        payload.temp_nim_nip || null,
        payload.temp_description || null,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  // 3. Menghapus draft (dipanggil saat pembatalan atau tiket selesai dibuat)
  async deleteDraft(telegram_chat_id) {
    const query = {
      text: 'DELETE FROM ticket_draft WHERE telegram_chat_id = $1 RETURNING telegram_chat_id',
      values: [telegram_chat_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0] || null;
  }

  // Fungsi untuk menghapus draft ticket yang lewat dari batas waktu
  async deleteExpiredDrafts(minutes = 15) {
    const query = {
      text: `
        DELETE FROM ticket_draft
        WHERE updated_at < NOW() - INTERVAL '${minutes} minutes'
        RETURNING telegram_chat_id
      `
    };

    const result = await this.pool.query(query);
    return result.rows;
  }
}

export default new TicketDraftRepositories();