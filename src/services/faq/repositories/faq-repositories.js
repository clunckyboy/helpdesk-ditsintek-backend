import { nanoid } from 'nanoid';
import pool from '../../../utils/database.js';

// In-memory FAQ store for development
let faqStore = [
  {
    id_faq: nanoid(16),
    question: 'Bagaimana cara reset password?',
    answer: 'Klik forgot password di halaman login, masukkan email Anda, dan ikuti instruksi yang dikirim ke email.',
    category: 'akun',
    embeddings: null,
  },
  {
    id_faq: nanoid(16),
    question: 'Jaringan saya tidak terhubung ke internet',
    answer: 'Coba restart router Anda, pastikan kabel LAN tersambung, atau hubungi IT helpdesk untuk bantuan teknis.',
    category: 'jaringan',
    embeddings: null,
  },
  {
    id_faq: nanoid(16),
    question: 'Bagaimana cara mengubah profile picture?',
    answer: 'Masuk ke settings, pilih profile, dan upload foto baru dari device Anda.',
    category: 'akun',
    embeddings: null,
  },
];

class FaqRepositories {
  constructor() {
    this.pool = pool;
  }

  async createFaq({ question, answer, category, embeddings = null }) {
    const id = nanoid(16);
    const query = {
      text: `
        INSERT INTO faq (id_faq, question, answer, category, embeddings)
        VALUES ($1, $2, $3, $4, $5::vector)
        RETURNING id_faq, question, answer, category, embeddings
      `,
      values: [
        id,
        question,
        answer,
        category,
        embeddings ? `[${embeddings.join(',')}]` : null,
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async searchFaqs(searchQuery, category = null, limit = 5) {
    const conditions = ['(question ILIKE $1 OR answer ILIKE $1)'];
    const values = [`%${searchQuery}%`];

    if (category) {
      values.push(category);
      conditions.push(`category = $${values.length}`);
    }

    const whereClause = conditions.join(' AND ');

    const query = {
      text: `
        SELECT
          id_faq,
          question,
          answer,
          category
        FROM faq
        WHERE ${whereClause}
        ORDER BY question ASC
        LIMIT $${values.length + 1}
      `,
      values: [...values, limit],
    };

    const result = await this.pool.query(query);
    return result.rows || [];
  }

  async getFaqById(id) {
    try {
      const query = {
        text: 'SELECT id_faq, question, answer, category FROM faq WHERE id_faq = $1',
        values: [id],
      };

      const result = await this.pool.query(query);
      return result.rows[0] || null;
    } catch (error) {
      // Fallback to in-memory store
      return faqStore.find((f) => f.id_faq === id) || null;
    }
  }

  async getAllFaqs(category = null) {
    try {
      let query;
      if (category) {
        query = {
          text: 'SELECT id_faq, question, answer, category FROM faq WHERE category = $1 ORDER BY question ASC',
          values: [category],
        };
      } else {
        query = {
          text: 'SELECT id_faq, question, answer, category FROM faq ORDER BY question ASC',
          values: [],
        };
      }

      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      // Fallback to in-memory store
      let results = faqStore;
      if (category) {
        results = results.filter((f) => f.category === category);
      }
      return results;
    }
  }
}

export default new FaqRepositories();
