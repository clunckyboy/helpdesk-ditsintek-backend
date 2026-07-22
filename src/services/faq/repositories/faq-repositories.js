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

  async searchFaqs(searchQuery, category = null, limit = 5) {
    // Normalize query for simple keyword matching (fallback when DB unavailable)
    const queryLower = searchQuery.toLowerCase();

    try {
      // Try database search with vector similarity
      const conditions = ['TRUE'];
      const values = [];

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
            category,
            1 - (embeddings <=> $1::vector) as similarity
          FROM faq
          WHERE ${whereClause}
          ORDER BY similarity DESC
          LIMIT $${values.length + 1}
        `,
        values: [...values, searchQuery, limit],
      };

      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      // Fallback to in-memory search with simple keyword matching
      let results = faqStore;

      if (category) {
        results = results.filter((f) => f.category === category);
      }

      // Simple keyword matching using includes for better matching
      results = results
        .map((faq) => {
          const questionLower = faq.question.toLowerCase();
          const answerLower = faq.answer.toLowerCase();
          
          // Check if query is found in question or answer
          const isInQuestion = questionLower.includes(queryLower);
          const isInAnswer = answerLower.includes(queryLower);
          
          // Calculate basic similarity score (higher is better)
          let similarity = 0;
          if (isInQuestion) similarity += 2; // Question match is more important
          if (isInAnswer) similarity += 1;
          
          return {
            ...faq,
            similarity,
          };
        })
        .filter((faq) => faq.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      return results;
    }
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
