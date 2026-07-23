import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import TicketMessageRepositories from "../repositories/ticket-message-repositories.js";

export const createMessage = async (req, res, next) => {
  const { id_user, sender_type, message_text } = req.validated;
  const { id: id_ticket } = req.params;

  const messageId = await TicketMessageRepositories.createMessage({
    id_ticket,
    id_user, 
    sender_type, 
    message_text,
  });

  if (!messageId) return next(new InvariantError('Pesan gagal dibuat'));

  return response(res, 201, 'Pesan berhasil dibuat', messageId);
}

export const getMessagesByTicketId = async (req, res, next) => {
  const { id: id_ticket } = req.params;

  const messages = await TicketMessageRepositories.getMessagesByTicketId(id_ticket);

  return response(res, 200, 'Pesan berhasil diambil', messages);
}