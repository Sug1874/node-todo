const Task = require("../models/Task")

const getTaskList = async(req, res) =>{
    const userName = req.session.user_name
    const pageNum = req.params.pageNum
    try{
        const taskList = await Task.getTaskList(userName, pageNum)
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
    const userName = req.session.user_name
    const taskId = req.params.taskId

    try{
        const task = await Task.getTask(userName, taskId)
        if(task){
            res.status(200).send(task)
        }else{
            res.status(400).end()
        }
    }catch(e){
        res.status(500).send(e.message)
    }
}

const createTask = async(req, res) =>{
    const userName = req.session.user_name
    const task = req.body.task
    task.user_name = userName

    try{
        await Task.saveTask(task)
        res.status(200).end()
    }catch(e){
        res.status(500).send(e.message)
    }
}

const updateTask = async(req, res) => {
    const userName = req.session.user_name
    const task = req.body.task
    const taskId = req.params.taskId
    task.task_id = taskId
    task.user_name = userName

    try{
        await Task.saveTask(task)
        res.status(200).end()
    }catch(e){
        res.status(500).send(e.message)
    }
}

const deleteTask = async(req, res) =>{
    const userName = req.session.user_name
    const taskId = req.params.taskId

    try{
        await Task.deleteTask(taskId)
        res.status(200).end()
    }catch(e){
        res.status(500).send(e.message)
    }
}

const modifyTasks = async(req, res) => {
    const userName = req.session.user_name
    const taskId = req.body.taskId

    try{
        await Task.modifyTask(taskId)
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
    modifyTasks: modifyTasks
}