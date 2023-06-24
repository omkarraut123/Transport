var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')
var Offers = require('./models/OffersSchema');
var UsersList = require('./models/UsersSchema');
var Rides = require('./models/RidesSchema');
var database = require('./database');
var app = express();

app.use(cors())

//DB connection sttring
mongoose.connect('mongodb://localhost/Carpoolz')

//For CORS
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization ,Accept');
  next();
});

//setting the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
  res.render("index")
})


//Login functionality
app.post('/login', function (req, res) {
  //console.log('inside login', req.body);
  var creds = req.body;
  var ret = {};
  UsersList.find(function (err, doc) {
    //console.log("doc", typeof doc)
    for (let i = 0; i < doc.length; i++) {
      //console.log('inside for', doc[i])
      if (doc[i].username == creds.userName && doc[i].password == creds.password) {
        //console.log('creds mathced');
        ret = {
          message: "Login successful", status: 200
        }
        res.send(ret);
      }
    }
  });
});

//Show the existing rides functionality
app.get('/show_rides', function (req, res, next) {
  var offers = [];
  Offers.find(function (err, availableOffers) {
    res.send(availableOffers);
  })
});

//Booking a ride
app.post('/book_ride', function (req, res) {
  //console.log('inside book_ride', req.body);
  let body = req.body;
  let ret = {};
  Rides.find(function (err, doc) {
    Rides.update(
      { _id: doc.length + 1001 },
      { $push: { rideId: doc.length + 1001, riderName: body.rider.name, rideeName: body.ridee, pickUp: body.rider.pickUp, destination: body.rider.destination, status: 'booked' } },
      function (err, raw) {
        Offers.update(
          { name: body.rider.name },
          { $inc: { seatsLeft: -1 } }, function () {
            res.send({
              id: doc.length + 1001,
              seatsLeft: body.rider.seatsLeft - 1,
              message: "Ride booked successfully",
              status: 200
            })
          }
        );
      }
    );
  })


})

//Cancel a ride
app.post('/cancel_ride', function (req, res) {
  //console.log('inside cancel ride', req.body);
  var params = req.body;
  Rides.find(function (err, doc) {
    Rides.update(
      { rideId: params.rideId },
      { $set: { status: 'cancelled' } },
      function (err, raw) {
        Offers.update(
          { riderId: params.rider },
          { $inc: { seatsLeft: 1 } }, function () {
            Offers.find(function (err, availableOffers) {
              //console.log("cancelled", availableOffers);
              res.send({
                message: "Ride cancelled successfully",
                status: 200
              })
            })

          }
        );
      }
    );
  })
})

//Offer a ride
app.post('/offer_ride', function (req, res) {
  console.log('inside offer_ride', req.body);
  let body = req.body;
  let ret = {};
  Offers.find(function (err, doc) {
    console.log("inside offer find");
    var newOffer = new Offers({
      id: doc.length + 1,
      name: body.name,
      car: body.car,
      seatsLeft: body.seatsLeft,
      pickUp: body.pickUp,
      destination: body.destination
    });
    newOffer.save(function (err,success) {
      if(err)
      {
        res.send(err);
      }
      res.send({
        message:"Offer added successfully",
        status:200
      })
    })
    // Offers.update(
    //   { $push: { id: doc.length + 1, name: body.name, car: body.car,  seatsLeft: body.seatsLeft, pickUp: body.pickUp, destination: body.destination } },
    //   function (err, raw) {
    //     Offers.find(function (err, availableOffers) {
    //       console.log("offer added", availableOffers);
    //       res.send({
    //         message: "Offer added successfully",
    //         status: 200
    //       })
    //     })
    //     // console.log('added successfully');

    //   }
    // );
  })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("not found")
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, '0.0.0.0', function() {
    console.log('Listening to port:  ' + 5000);
});


module.exports = app;