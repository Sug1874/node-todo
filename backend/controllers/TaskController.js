const Task = require("../models/Task")
const TaskRepository = require("../repositories/TaskRepository")

const getTaskList = async(req, res) =>{
    const user_name = req.session.user_name
    const pageNum = req.params.pageNum
    try{
        const taskList = await Task.getTaskList(user_name, pageNum)
        if(taskList.length > 0){
            res.status(200).send(taskList)
        }else{
            res.status(400).end()
        }
    }catch(e){
        res.status(500).send(e.message)
    }
}

const getTask = async(req, res) =>{
    const user_name = req.session.user_name
    const task_id = req.params.task_id

    try{
        const task = await Task.getTask(user_name, task_id)
        if(task){
            const beforeTasks = await Task.getBeforeTasks(task_id)
            res.status(200).send({task:task, before_tasks: beforeTasks})
        }else{
            res.status(400).end()
        }
    }catch(e){
        res.status(500).send(e.message)
    }
}

const createTask = async(req, res) =>{
    const user_name = req.session.user_name
    const task = req.body.task
    task.user_name = user_name
    // task_idのリスト
    const beforeTasks = req.body.before_tasks

    try{
        await Task.saveTask(task)
        res.status(200).end()
    }catch(e){
        res.status(500).send(e.message)
    }
}

const updateTask = async(req, res) => {
    const user_name = req.session.user_name
    const task = req.body.task
    const task_id = req.params.task_id
    task.task_id = task_id
    task.user_name = user_name
    // task_idのリスト
    const beforeTasks = req.body.before_tasks

    try{
        await Task.saveTask(task)
        res.status(200).end()
    }catch(e){
        res.status(500).send(e.message)
    }
}

const deleteTask = async(req, res) =>{
    const user_name = req.session.user_name
    const task_id = req.params.task_id

    try{
        const result = await Task.deleteTask(user_name, task_id)
        if(result){
            res.status(200).end()
        }else{
            res.status(400).end()
        }
    }catch(e){
        res.status(500).send(e.message)
    }
}

const modifyTasks = async(req, res) => {
    const user_name = req.session.user_name
    const task_id = req.body.task_id

    try{
        await Task.modifyTask(task_id)
        res.status(200).end()
    }catch(e){
        res.status(500).send(e.message)
    }
}

module.exports = {
    getTaskList: getTaskList,
    getTask: getTask,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    modifyTasks: modifyTasks,
}