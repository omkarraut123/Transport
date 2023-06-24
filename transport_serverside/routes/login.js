var express = require('express');
var router = express.Router();
var UsersList = require('./../models/UsersSchema');

/* GET home page. */
router.post('/', function (req, res, next) {
  var creds = req.body;
  UsersList.find(function (err, doc) {
    for (let i = 0; i < doc.length; i++) {
      if (doc[i].username == creds.username && doc[i].password == creds.password) {
        res.send({
          message: "Login Successful"
        });
      }
      else {
        res.send({
          message: "Credential Mismatch"
        })
      }
    }
  });
});

module.exports = router;
