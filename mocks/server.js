const path = require('path');
const jsonServer = require('json-server');

const PORT = process.env.PORT || 9000;
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Override response
router.render = (req, res) => {
  let data = res.locals.data;
  if(Array.isArray(res.locals.data)) {
    data = {
      items: res.locals.data,
      total: 21
    }
  }
  res.jsonp(data);
};

server.use(router);
server.listen(PORT, () => {
  console.log('JSON Server is running');
});
