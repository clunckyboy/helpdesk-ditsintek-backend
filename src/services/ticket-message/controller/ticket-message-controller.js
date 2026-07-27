import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import TicketMessageRepositories from "../repositories/ticket-message-repositories.js";
import TicketRepositories from '../../ticket/repositories/ticket-repositories.js';

export const createMessage = async (req, res, next) => {
  const { id_user, sender_type, message_text } = req.validated;
  const { id: id_ticket } = req.params;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  const messageId = await TicketMessageRepositories.createMessage({
    id_ticket,
    id_user, 
    sender_type, 
    message_text,
  });

  if (!messageId) return next(new InvariantError('Pesan gagal dibuat'));

  if (sender_type === 'helpdesk' || sender_type === 'admin') {
   const ticket = await TicketRepositories.getTicketById(id_ticket);
   const botToken = process.env.TELEGRAM_BOT_TOKEN;
   
   // Tembak ke API Telegram
   await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         chat_id: ticket.telegram_chat_id,
         text: `${message_text}` // Balasan Helpdesk
      })
   });
}
  
  return response(res, 201, 'Pesan berhasil dibuat', messageId);
}

export const getMessagesByTicketId = async (req, res, next) => {
  const { id: id_ticket } = req.params;

  const messages = await TicketMessageRepositories.getMessagesByTicketId(id_ticket);

  return response(res, 200, 'Pesan berhasil diambil', messages);
}