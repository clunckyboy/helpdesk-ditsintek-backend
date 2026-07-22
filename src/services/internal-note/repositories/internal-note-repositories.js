import pool from '../../../utils/database.js';
import { nanoid } from 'nanoid';

class InternalNoteRepositories {
  constructor() {
    this.pool = pool;
  }

  async createNote({ id_ticket, id_user, note_text }) {
    const id = nanoid(16);

    const query = {
      text: `INSERT INTO 
              internal_note (id_note, id_ticket, id_user, note_text)
            VALUES
              ($1, $2, $3, $4)
            RETURNING 
              id_note`,
      values: [id, id_ticket, id_user, note_text]
    };

    const noteId = await this.pool.query(query);
    return noteId.rows[0];
  }
}

export default new InternalNoteRepositories;