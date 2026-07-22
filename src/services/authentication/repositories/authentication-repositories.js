import { Pool } from 'pg';
import pool from '../../../utils/database.js';

class AuthenticationRepositories {
  constructor() {
    this.pool = pool;
  }

  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentication VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentication WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentication WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);
    if (!result.rows.length) {
      return false;
    }

    return result.rows[0];
  }
}

export default new AuthenticationRepositories();