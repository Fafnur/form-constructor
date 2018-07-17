const path = require('path');
const jsonServer = require('json-server');

const PORT = process.env.PORT || 9000;
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Fake authorization
server.use((req, res, next) => {
  if (req.path === '/api/token') {
    if (req.body.login === 'test@example.com' && req.body.password === '12345') {
      res.jsonp({
        "code": "success",
        "data": {
          "accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2MTY5MjE1MTYsInN1YiI6IjEiLCJyZWZyZXNoIjoiZmFsc2UiLCJjYyI6IjY5ODY5MzQ5LTkyMTYtNGFhMi1hYWE2LTBmMDk3Y2NmZWQxMyIsInZycyI6MSwicGx0ZiI6IndlYiJ9.HGr7oFF4LfAdYnO6kVUZBmfagWBTBuGvR9y_hei2lti6gT1rzdBg-kSn-ZDzCCHQUvLcWLReabzgmSReQc8qpA",
          "accessTokenExpire": "2021-03-28T08:51:56.733+0000",
          "refreshToken": null,
          "authInfo": {
            "displayName": "test@example.com",
            "userId": 1
          }
        }
      });
    } else {
      res.status(401).jsonp({
        code: "error",
        error: "Wrong data"
      });
    }
  } else if (req.path === '/api/token/validate') {
    res.status(200).jsonp({
      code: "success",
      data: {}
    });
  } else {
    next();
  }
});

// Override response
router.render = (req, res) => {
  res.jsonp({
    code: "success",
    data: res.locals.data
  });
};

server.use(router);
server.listen(PORT, () => {
  console.log('JSON Server is running');
});
