var mongoose = require('mongoose');
var UsersList = require('./models/UsersSchema');

mongoose.connect("mongodb://localhost/Transport", function () {
    console.log("db connected");
    mongoose.connection.db.dropDatabase();
    console.log('data stored successfully');

});