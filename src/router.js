const {addBuku, getBuku, getBukubyId, updateBuku, deleteBuku} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBuku,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getBuku,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBukubyId,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBuku,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBuku,
  },
];

module.exports = routes;
