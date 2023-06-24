var express = require('express');
var router = express.Router();
var Offers = require('./../models/OffersSchema');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("inside show_all_rides");
  var offers = [];
  Offers.find(function (err, availableOffers) {
    console.log("available Rides", availableOffers);
    res.send(availableOffers);
  })
});

module.exports = router;
