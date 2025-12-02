/*
import express, mongoose, apis, auth (delete irrelevant later during cleaning)
instantiate express router
route to the apis
export route
*/

const express=require('express');
const auth=require('../middleware/authMiddleware');
const {addTask, updateDescription, updateStatus, deleteTask}=require('../controllers/taskController')

const router=express.Router();

//PRIVATE APIs
//should authenticate for each user. instead of adding :id to the path to authenticate
//use the JWT instead. Is safer and avoid redundancy
//Add new task post
router.post('/', auth, addTask);

//update task description patch
router.patch('/:taskId/description', auth, updateDescription);

//update task status patch
router.patch('/:taskId/status', auth, updateStatus);

/*Soft Delete task delete
Should not really delete, just mark task as Deleted. The only thing we truly delete is the user profile
which I think in real life doesn't even happen in big tech
*/
router.delete('/:taskId', auth, deleteTask);

module.exports=router;
