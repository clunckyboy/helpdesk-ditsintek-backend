import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import pool from '../../../utils/database.js';

class UserRepositories {
  constructor() {
    this.pool = pool;
  }

  async createUser({ name, username, password, role }) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO "user" values($1, $2, $3, $4, $5) returning id_user',
      values: [id, name, username, hashedPassword, role],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getAllUsers() {
    const result = await this.pool.query('SELECT * FROM "user"');
    return result.rows;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM "user" WHERE id_user = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async updateUserById(id, name, username, password, role) {
    const query = {
      text: 'UPDATE "user" SET name = $1, username = $2, password = $3, role = $4 WHERE id_user = $5 RETURNING id_user',
      values: [name, username, password, role, id],
    };

    const user = await this.pool.query(query);
    return user.rows[0];
  }

  async deleteUserById(id) {
    const user = await this.pool.query(`DELETE FROM "user" WHERE id_user = $1 RETURNING id_user`, [id]);
    return user.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id_user, password FROM "user" WHERE username = $1',
      values: [username],
    };

    const user = await this.pool.query(query);

    if (user.rows.length === 0) {
      return null;
    }

    const { id_user, password: hashedPassword } = user.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return null;
    }

    return id_user;
  }
}

export default new UserRepositories;