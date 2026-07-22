import { nanoid } from 'nanoid';
import pool from '../../../utils/database.js';

class TicketMessageRepositories {
  constructor() {
    this.pool = pool;
  }

  async createMessage({ id_ticket, id_user, sender_type, message_text }) {
    const id = nanoid(16);

    const query = {
      text: `INSERT INTO 
              ticket_message (id_message, id_ticket, id_user, sender_type, message_text)
            VALUES
              ($1, $2, $3, $4, $5)
            RETURNING
              id_message`,
      values: [id, id_ticket, id_user, sender_type, message_text]
    }

    const messageId = await this.pool.query(query);
    return messageId.rows[0];
  }
}

export default new TicketMessageRepositories;