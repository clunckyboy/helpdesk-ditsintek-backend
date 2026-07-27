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
  pgm.createSequence('ticket_id_seq', {
    start: 1,
  });

  pgm.alterColumn('ticket', 'id_ticket', {
    default: pgm.func(`'TKT-' || LPAD(nextval('ticket_id_seq')::text, 8, '0')`),
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.alterColumn('ticket', 'id_ticket', {
    default: null,
  });

  pgm.dropSequence('ticket_id_seq');
};
