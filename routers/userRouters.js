//should route client request params to the user apis

/* TODO
Note: we route to these API by the base users e.g /all_users is actually users/all_users
import express, mongoose
import the apis you want to route
import the authenticator middleware
instantiate the express router 
route
export the router
*/

const express=require('express');
const auth=require('../middleware/authMiddleware')
const {
  register,
  login,
  getAllUsers,
  getUser,
  changePassword,
  changeName,
  changeEmail,
  deleteUser
} = require('../controllers/userController');

const router=express.Router();

//Route as follows

// PUBLIC ROUTES
// post users/register -> register
router.post('/register', register);
// post  users/login -> login
router.post('/login', login);
//get all users users/all_users
router.get('/all', getAllUsers);

//PRIVATE ROUTES
// get users/user
// router.get('/:id', auth, getUser); 
router.get('/user', auth, getUser); //more secure, we will use id from JWT
// post users/:id/change_password/ -> change password
router.patch('/change_password', auth, changePassword);

// post users/:id/change_name -> change user first and last name and nothing else
router.patch('/change_name', auth, changeName);

//  post users/change_email -> change user email
router.patch('/change_email', auth, changeEmail);

//  delete users/delete_user -> delete user's profile
router.delete('/delete_user', auth, deleteUser);

//export
module.exports=router;



////////////////////////////////////

// const express=require('express');
// const auth=require('../middleware/authMiddleware')
// const {
//   register,
//   login,
//   getUser,
//   changePassword,
//   changeName,
//   changeEmail,
//   deleteUser
// } = require('../controllers/userController');

// const router=express.Router();

// //Route as follows

// // PUBLIC ROUTES
// // post home/register -> register
// router.post('/register', register);
// // post  home/login -> login
// router.post('/login', login);

// //PRIVATE ROUTES
// // get users/:id -> get_user profile by id
// router.get('/:id', auth, getUser);
// // post users/:id/change_password/ -> change password
// router.patch('/:id/change_password', auth, changePassword);

// // post users/:id/change_name -> change user first and last name and nothing else
// router.patch('/:id/change_name', auth, changeName);

// //  post users/:id/change_email -> change user email
// router.patch('/:id/change_email', auth, changeEmail);

// //  delete users/:id/delete_user -> delete user's profile
// router.delete('/:id/delete_user', auth, deleteUser);

// //export
// module.exports=router;

