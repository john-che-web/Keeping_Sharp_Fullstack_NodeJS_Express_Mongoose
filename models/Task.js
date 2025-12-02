const mongoose=require('mongoose');

//implement the task schema
//export task schema
//start thinking about how authentication will work for tasks i.e should only be able to add and view if authenticated

const taskSchema=mongoose.Schema({
   name: {type: String, maxlength: 50, trim:true, required:true},
   description: {type: String, trim:true, required:true},
   status: { type: String, //status should be from a select list of inputs and should throw an error if anything else is provided
             enum: ['Pending', 'Complete', 'Deleted'],
             default: 'Pending'
            },
   user_Id: { type:mongoose.Schema.Types.ObjectId, //use populate with fetching to popoluate user id on the backend
              ref: 'User', //reference the User model
              required:true
            }
    },{
        timestamps:true //for created at and updated at
    });

module.exports=mongoose.model('Task', taskSchema);