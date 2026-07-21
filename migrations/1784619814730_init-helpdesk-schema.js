/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // neon vector extension
  pgm.sql('CREATE EXTENSION IF NOT EXISTS vector;');

  // create table user
  pgm.createTable('user', {
    id_user: {
      type: 'VARCHAR(25)', 
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    role: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  // create table ticket
  pgm.createTable('ticket', {
    id_ticket: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    telegram_chat_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    reporter: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    reporter_role: {
      type: 'VARCHAR(30)',
    },
    nim_nip: {
      type: 'VARCHAR(50)',
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    assigned_to: {
      type: 'VARCHAR(25)',
      references: '"user"(id_user)',
      onDelete: 'SET NULL',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('current_timestamp')
    }
  });

  // create table faq
  pgm.createTable('faq', {
    id_faq: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    question: {
      type: 'TEXT',
      notNull: true
    },
    answer: {
      type: 'TEXT',
      notNull: true,
    },
    category: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    embeddings: {
      type: 'VECTOR(768)'
    }
  });

  // create table internal_note
  pgm.createTable('internal_note', {
    id_note: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    id_ticket: {
      type: 'VARCHAR(25)',
      references: 'ticket(id_ticket)',
      notNull: true,
    },
    id_user: {
      type: 'VARCHAR(25)',
      references: '"user"(id_user)',
      notNull: true,
    },
    note_text: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('current_timestamp')
    }
  });


  // create table ticket_message
  pgm.createTable('ticket_message', {
    id_message: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    id_ticket: {
      type: 'VARCHAR(25)',
      references: 'ticket(id_ticket)', 
      notNull: true,
    },
    id_user: {
      type: 'VARCHAR(25)',
      references: '"user"(id_user)',
    },
    sender_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    message_text: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('current_timestamp')
    }
  });

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // rollback
  pgm.dropTable('ticket_message');
  pgm.dropTable('internal_note');
  pgm.dropTable('faq');
  pgm.dropTable('ticket');
  pgm.dropTable('"user"');
};
