const mongoose=require('mongoose');

//implement the user schema
//export user schema
//start thinking about how authentication will work

const userSchema=mongoose.Schema({
   firstName: {type: String, maxlength: 50, trim:true, required:true},
   lastName: {type: String, maxlength: 50, trim:true, required:true},
   email: {type: String, maxlength: 50, trim:true, required:true, unique:true, match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/}, //email verifier regex
   password: {type: String, minlength: 50, trim:true, required:true, minlength:6, select:false} //should be salted before added
    },{
        timestamps:true //for created at and updated at
    });

module.exports=mongoose.model('User', userSchema);


