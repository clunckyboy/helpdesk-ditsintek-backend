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
  pgm.createTable('ticket_draft', {
    telegram_chat_id: {
      type: 'VARCHAR(100)',
      primaryKey: true, // Satu user Telegram hanya bisa punya 1 sesi aktif
    },
    step: {
      type: 'VARCHAR(50)',
      notNull: true,
      // Contoh isi: 'waiting_role', 'waiting_nim', 'waiting_description'
    },
    temp_name: {
      type: 'VARCHAR(70)',
    },
    temp_role: {
      type: 'VARCHAR(40)',
    },
    temp_nim_nip: {
      type: 'VARCHAR(50)',
      // Menyimpan data sementara
    },
    temp_description: {
      type: 'TEXT',
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('ticket_draft');
};
