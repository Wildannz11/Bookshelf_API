const books = require('./books');
const {nanoid} = require('nanoid');

const addBuku = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if ( pageCount === readPage ) {
    finished = true;
  }
  if (readPage > pageCount ) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (name === undefined || name === null || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  const newBooks = {id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt};

  books.push(newBooks);

  const inserted = books.filter((book) => book.id === id).length > 0;

  if (inserted) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getBuku = (request, h) => {
  const {name, reading, finished} = request.query;

  if (name) {
    // const mapBuku = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const nonCaseName = name.toLowerCase();
    const response = h.response({
      status: 'success',
      data: {
        books: books
            .filter((book)=> book.name === nonCaseName)
            .map((books)=> ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),

        // books
        // .filter((book) => book.name === nonCaseName)
        // .map((books) => ({
        //   id: books.id,
        //   name: books.name,
        //   publisher: books.publisher,
        // }))
      },
    });
    response.code(200);
    return response;
  } else if (finished === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
            .filter((book) => book.finished === false)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  } else if (finished === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
            .filter((book) => book.finished === true)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  } else if (reading === '1') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
            .filter((book) => book.reading === true)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  } else if (reading === '0') {
    const response = h.response({
      status: 'success',
      data: {
        books: books
            .filter((book) => book.reading === false)
            .map((books) => ({
              id: books.id,
              name: books.name,
              publisher: books.publisher,
            })),
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};


const getBukubyId = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  // if (book !== undefined || book !== null){
  //   const response = h.response({
  //     status: 'success',
  //     data: {
  //       book
  //     },
  //   });
  //   response.code(200);
  //   return response;
  // }
  // else {
  //   const response = h.response({
  //     status: 'fail',
  //     message: 'Buku tidak ditemukan',
  //   });
  //   response.code(404);
  //   return response;
  // }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBuku = (request, h) => {
  const {bookId} = request.params;
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  if (name === undefined || name === null || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount ) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = books.findIndex((book) => book.id === bookId);

  if (id !== -1) {
    books[id] = {
      ...books[id],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: `Buku berhasil diperbarui`,
    });

    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: `Gagal memperbarui buku. Id tidak ditemukan`,
  });

  response.code(404);
  return response;
};

const deleteBuku = (request, h) => {
  const {bookId} = request.params;
  const id = books.findIndex((book) => book.id === bookId);

  if (id !== -1) {
    books.splice(id, 1);
    const response = h.response({
      status: 'success',
      message: `Buku berhasil dihapus`,
    });

    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: `Buku gagal dihapus. Id tidak ditemukan`,
    });

    response.code(404);
    return response;
  }
};

module.exports = {addBuku, getBuku, getBukubyId, updateBuku, deleteBuku};
