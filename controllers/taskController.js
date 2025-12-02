const mongoose=require('mongoose');
const Task = require('../models/Task'); 

/*
Contains task CRUD APIs like update tasks, delete tasks, add tasks, get tasks for a user's UI
*/

//PRIVATE APIs
// Add a new task
const addTask = async function(req, res) {
    try {
        const { name, description } = req.body;

        const task = await Task.create({
            user_Id: req.user.id,
            name,
            description,
            status: 'Pending'
        });

        // Populate user info from the User table. Note that this is only possible because we added user_id as
        //a reference in the model. We specify the fields we want by separated them by space in the second argument
        await task.populate('user_Id', 'firstName lastName email');

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task description
const updateDescription = async function(req, res) {
    try {
        const { taskId } = req.params;
        const { description } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: taskId, user_Id: req.user.id, status: { $ne: 'Deleted' } },
            { description },
            { new: true }
        ).populate('user_Id', 'firstName lastName email');

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.json({ message: 'Description updated successfully', task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update task status
const updateStatus = async function(req, res) {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Complete', 'Deleted'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const task = await Task.findOneAndUpdate(
            { _id: taskId, user_Id: req.user.id, status: { $ne: 'Deleted' } },
            { status },
            { new: true }
        ).populate('user_Id', 'firstName lastName email');
        //

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.json({ message: 'Status updated successfully', task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Soft delete task
const deleteTask = async function(req, res) {
    try {
        const { taskId } = req.params;

        // _id: taskId → match a task with this specific ID.
        // user_Id: req.user.id → match only tasks belonging to the logged-in user.
        // status: { $ne: 'Deleted' } → match only tasks whose status is NOT 'Deleted.
        //last one ensures we update only tasks that do not equal deleted already
        const task = await Task.findOneAndUpdate(
            { _id: taskId, user_Id: req.user.id, status: { $ne: 'Deleted' } },
            { status: 'Deleted' },
            { new: true }
        ).populate('user_Id', 'firstName lastName email');

        if (!task) return res.status(404).json({ error: 'Task not found' });

        res.json({ message: 'Task deleted successfully', task });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    addTask,
    updateDescription,
    updateStatus,
    deleteTask
};