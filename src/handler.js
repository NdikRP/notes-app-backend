const { nanoid } = require('nanoid');
const notes = require('./notes');

const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  try {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        title,
        tags,
        body,
        updatedAt,
      };

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      });
      response.code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Internal Server Error',
    });
    response.code(500);
    return response;
  }
};

const getNoteByIdHandler = (request, h) => {
  try {
    const { id } = request.params;
    const note = notes.find((n) => n.id === id);

    if (note) {
      return {
        status: 'success',
        data: {
          note,
        },
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Internal Server Error',
    });
    response.code(500);
    return response;
  }
};

const addNoteHandler = (request, h) => {
  try {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      title,
      tags,
      body,
      id,
      createdAt,
      updatedAt,
    };

    notes.push(newNote);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error(error);
    const response = h.response({
      status: 'error',
      message: 'Internal Server Error',
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
