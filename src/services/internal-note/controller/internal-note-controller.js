import InternalNoteRepositories from '../repositories/internal-note-repositories.js';
import response from '../../../utils/response.js';

export const createNote = async (req, res, next) => {
  const { id_user, note_text } = req.validated;
  const { id: id_ticket } = req.params;

  const noteId = await InternalNoteRepositories.createNote({
    id_ticket,
    id_user,
    note_text
  });

  if (!noteId) return next(new InvariantError('Catatan gagal dibuat'));

  return response(res, 201, 'Catatan berhasil dibuat', noteId);
}

export const getNotesByTicketId = async (req, res, next) => {
  const { id: id_ticket } = req.params;

  const notes = await InternalNoteRepositories.getNotesById(id_ticket);
  
  return response(res, 200, 'Catatan berhasil diambil', notes);
}