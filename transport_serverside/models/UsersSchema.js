var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UsersSchema= new Schema({
  name:String,
  email:String,
  password:String,
  phone:String,
});

module.exports=mongoose.model("Userslist",UsersSchema);
