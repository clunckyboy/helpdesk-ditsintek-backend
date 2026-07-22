import test from 'node:test';
import assert from 'node:assert/strict';
import { createTicketPayloadSchema, updateTicketStatusPayloadSchema } from '../src/services/ticket/validator/schema.js';

test('createTicketPayloadSchema sets default status to open', () => {
  const { error, value } = createTicketPayloadSchema.validate({
    telegram_chat_id: '12345',
    reporter: 'Budi',
    description: 'Jaringan mati',
    category: 'jaringan',
  });

  assert.equal(error, undefined);
  assert.equal(value.status, 'open');
});

test('updateTicketStatusPayloadSchema accepts status and assigned_to', () => {
  const { error, value } = updateTicketStatusPayloadSchema.validate({
    status: 'in_progress',
    assigned_to: 'user-1',
  });

  assert.equal(error, undefined);
  assert.equal(value.status, 'in_progress');
  assert.equal(value.assigned_to, 'user-1');
});
