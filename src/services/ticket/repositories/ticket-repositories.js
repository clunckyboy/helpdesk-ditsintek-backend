import { nanoid } from 'nanoid';
import pool from '../../../utils/database.js';

// In-memory store for development/testing when DB is not available
let ticketsStore = [];

class TicketRepositories {
  constructor() {
    this.pool = pool;
  }

  async createTicket(payload) {
    const id = nanoid(16);
    
    try {
      const query = {
        text: `
          INSERT INTO ticket (
            id_ticket, telegram_chat_id, reporter, reporter_role, nim_nip, description, status, category, assigned_to
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id_ticket
        `,
        values: [
          id,
          payload.telegram_chat_id,
          payload.reporter,
          payload.reporter_role || null,
          payload.nim_nip || null,
          payload.description,
          payload.status || 'open',
          payload.category,
          payload.assigned_to || null,
        ],
      };

      const result = await this.pool.query(query);
      return result.rows[0];
    } catch (error) {
      // Fallback to in-memory store if DB unavailable
      const newTicket = {
        id_ticket: id,
        ...payload,
        status: payload.status || 'open',
        created_at: new Date(),
        updated_at: new Date(),
      };
      ticketsStore.push(newTicket);
      return newTicket;
    }
  }

  async getAllTickets(filters = {}) {
    try {
      const { status, category } = filters;
      const conditions = [];
      const values = [];

      if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
      }

      if (category) {
        values.push(category);
        conditions.push(`category = $${values.length}`);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = {
        text: `SELECT * FROM ticket ${whereClause} ORDER BY created_at DESC`,
        values,
      };

      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      // Fallback to in-memory store if DB unavailable
      let filtered = [...ticketsStore];
      
      if (filters.status) {
        filtered = filtered.filter(t => t.status === filters.status);
      }
      if (filters.category) {
        filtered = filtered.filter(t => t.category === filters.category);
      }
      
      return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }

  async getTicketById(id) {
    try {
      const query = {
        text: `
          SELECT t.*, json_agg(tm) AS messages
          FROM ticket t
          LEFT JOIN ticket_message tm ON tm.id_ticket = t.id_ticket
          WHERE t.id_ticket = $1
          GROUP BY t.id_ticket
        `,
        values: [id],
      };

      const result = await this.pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      // Fallback to in-memory store if DB unavailable
      return ticketsStore.find(t => t.id_ticket === id) || null;
    }
  }

  async updateTicketStatus(id, status, assignedTo) {
    try {
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
    } catch (error) {
      // Fallback to in-memory store if DB unavailable
      const ticket = ticketsStore.find(t => t.id_ticket === id);
      if (ticket) {
        if (status !== undefined) ticket.status = status;
        if (assignedTo !== undefined) ticket.assigned_to = assignedTo;
        ticket.updated_at = new Date();
        return { id_ticket: id };
      }
      return null;
    }
  }
}

export default new TicketRepositories();
