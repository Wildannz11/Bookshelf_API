
const hapi = require('@hapi/hapi');
const routes = require('./router');

const init = async () => {
  const server = hapi.Server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      }
    }
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada : ${server.info.uri}`);
};
module.exports = init;
