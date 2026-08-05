import pool from '../../../utils/database.js';
import { customAlphabet } from 'nanoid';

const generateRandomString = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

class TicketRepositories {
  constructor() {
    this.pool = pool;
  }

  async createTicket(payload) {

    const newTicketId = `TKT-${generateRandomString()}`;

    const admin = await this.pool.query(`
      SELECT id_user FROM "user" WHERE role = 'admin' LIMIT 1
    `);
    const adminId = admin.rows.length > 0 ? admin.rows[0].id_user : null;

    const query = {
      text: `
        INSERT INTO ticket (
          id_ticket, telegram_chat_id, reporter, reporter_role, nim_nip, description, status, assigned_to
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_ticket
      `,
      values: [
        newTicketId,
        payload.telegram_chat_id,
        payload.reporter,
        payload.reporter_role || null,
        payload.nim_nip || null,
        payload.description,
        payload.status || 'open',
        payload.assigned_to || adminId, 
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllTickets(filters = {}) {
    const { status, category } = filters;
    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`ticket.status = $${values.length}`);
    }

    if (category) {
      values.push(category);
      conditions.push(`ticket.category = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = {
      text: `
        SELECT 
          ticket.*,
          "user".name AS assigned_to_name 
        FROM ticket 
        LEFT JOIN "user" ON ticket.assigned_to = "user".id_user
        ${whereClause}
        ORDER BY ticket.created_at DESC`,
      values,
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getTicketById(id) {
    const query = {
      text: `
        SELECT 
          ticket.*,
          "user".name AS assigned_to_name
        FROM ticket
        LEFT JOIN "user" ON ticket.assigned_to = "user".id_user
        WHERE ticket.id_ticket = $1`,
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0] || null;
  }

  async updateTicketStatus(id, status, assignedTo) {
    const query = {
      text: `
        UPDATE ticket
        SET status = $1, assigned_to = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id_ticket = $3
        RETURNING id_ticket
      `,
      values: [status, assignedTo || null, id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getOpenTicketByTelegramId(telegram_chat_id) {
    const query = {
      text: `
        SELECT * FROM ticket 
        WHERE telegram_chat_id = $1 AND status IN ('open', 'in_progress', 'resolved') 
        ORDER BY created_at DESC 
        LIMIT 1
      `,
      values: [telegram_chat_id],
    };

    const result = await this.pool.query(query);
    return result.rows[0] || null;
  }
}

export default new TicketRepositories();
