var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')
var UsersList = require('./models/UsersSchema');
var database = require('./database');
var app = express();

app.use(cors())

//DB connection sttring
mongoose.connect('mongodb://localhost/Transport')

//For CORS
var corsOptions = {
  origin: 'http://localhost:4000',
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
  console.log('inside login', req.body);
  var creds = req.body;
  console.log("creds" , creds);
  var ret = {};
  let isValidUser = false;
  UsersList.find(function (err, doc) {
    console.log("doc", doc.length)
    for (let i = 0; i < doc.length; i++) {
      console.log('inside for', doc[i])
      if (doc[i].email == creds.email && doc[i].password == creds.password) {
        console.log('creds mathced');
        isValidUser = true;
      }
    }
    if(isValidUser){
      ret ={
        message: "valid",
      }
    }else{
      ret = {
        message: "invalid",
      }
    }
    res.send(ret)
    
  });
});

app.post('/register', function (req, res) {
  console.log('inside register', req.body);
  let body = req.body;
  let ret = {};
  UsersList.find(function (err, doc) {
    console.log("inside userlist find");
    var user = new UsersList({
      name: body.name,
      phone:body.phone,
      password: body.password,      
      email: body.email,
      
    });
    user.save(function (err,success) {
      if(err)
      {
        res.send(err);
      }
      res.send({
        message:"user registered successfully",
        status:200
      })
    })
  });
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