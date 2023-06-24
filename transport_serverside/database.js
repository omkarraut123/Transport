var mongoose = require('mongoose');
var OffersList = require('./models/OffersSchema')
var RidesList = require('./models/RidesSchema');
var UsersList = require('./models/UsersSchema');

mongoose.connect("mongodb://localhost/Carpoolz", function () {
    console.log("db connected");
    mongoose.connection.db.dropDatabase();

    var users = [{
        username: "krishna",
        password: "krishna"
    }, {
        username: "kalpana",
        password: "kalpana"
    }, {
        username: "admin",
        password: "admin"
    }];

    users.forEach(function (user) {
        new UsersList(user).save();
    });

    var offers = [{
        offerId: "1000",
        name: "Krishna",
        car: "Swift",
        seatsLeft: 2,
        pickUp: "MNG SEZ",
        destination: "Pumpwell"
    },
    {
        offerId: "1001",
        name: "Shiva",
        car: "Audi",
        seatsLeft: 3,
        pickUp: "MNG SEZ",
        destination: "Kottara"
    },
    {
        offerId: "1002",
        name: "Preethi",
        car: "Huidai i10",
        seatsLeft: 2,
        pickUp: "Hampankatta",
        destination: "MNG SEZ"
    },
    {
        offerId: "1003",
        name: "Deepak",
        car: "Range Rover",
        seatsLeft: 1,
        pickUp: "MNG SEZ",
        destination: "MNG STP"
    }]

    offers.forEach(function(offer,index){
        offer.id = index;
        new OffersList(offer).save();
    });

    console.log('data stored successfully');

});