import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import TicketRepositories from '../repositories/ticket-repositories.js';

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await TicketRepositories.createTicket(req.validated);

    if (!ticket) {
      return next(new InvariantError('Ticket gagal ditambahkan'));
    }

    return response(res, 201, 'Ticket berhasil ditambahkan', { id: ticket.id_ticket });
  } catch (error) {
    next(error);
  }
};

export const getAllTickets = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      category: req.query.category,
    };

    const tickets = await TicketRepositories.getAllTickets(filters);
    return response(res, 200, 'Tickets berhasil diambil', tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await TicketRepositories.getTicketById(id);

    if (!ticket) {
      return next(new NotFoundError('Ticket tidak ditemukan'));
    }

    return response(res, 200, 'Ticket berhasil diambil', ticket);
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newStatus = req.validated.status;
    const existingTicket = await TicketRepositories.getTicketById(id);

    if (!existingTicket) {
      return next(new NotFoundError('Ticket tidak ditemukan'));
    }

    const ticketId = await TicketRepositories.updateTicketStatus(
      id,
      newStatus,
      req.validated.assigned_to,
    );

    if (!ticketId) {
      return next(new InvariantError('Ticket gagal diupdate'));
    }

    if (newStatus === 'resolved') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const messageText = `Halo! Tim Helpdesk menyampaikan bahwa kendala pada tiket #${id} Anda sudah diperbaiki. Apakah masalah tersebut benar sudah selesai?`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: existingTicket.telegram_chat_id,
          text: messageText,
          reply_markup: {
            inline_keyboard: [[
              { text: "✅ Sudah Selesai", callback_data: `action_closed_${id}` },
              { text: "❌ Belum, Masih Error", callback_data: `action_open_${id}` }
            ]]
          }
        })
      });
    }

    return response(res, 200, 'Ticket berhasil diupdate', ticketId);
  } catch (error) {
    next(error);
  }
};
