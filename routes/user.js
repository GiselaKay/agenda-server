var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/newUser', function (req, res, next) {
  user.createUser('asas', function (err, id, status) {
    if (!err) {
      res.json(id);
    }
  });
});

module.exports = router;
