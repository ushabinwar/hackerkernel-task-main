const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: String,
    task_name: String,
    task_type: String,
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;

//XyKSyEZDVIFF3fhn
//ushabinwar
//mongodb+srv://ushabinwar:XyKSyEZDVIFF3fhn@hackerdb.cs5rbuw.mongodb.net/?retryWrites=true&w=majority&appName=Hackerdb