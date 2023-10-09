const Task = require("../models/Task")
const TaskRepository = require("../repositories/TaskRepository")
const TaskService = require("../services/TaskService")

const getTaskList = async(req, res) =>{
    const user_name = req.body.user_name
    const pageNum = req.params.pageNum
    try{
        const [taskNum, taskList] = await Task.getTaskList(user_name, pageNum)
        if(taskList){
            res.status(200).send({task_num: taskNum, tasks: taskList})
        }else{
            res.status(400).end()
        }
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

const getAllTaskList = async(req, res) =>{
    const user_name = req.body.user_name
    try{
        const taskList = await Task.getAllTaskList(user_name)
        if(taskList){
            res.status(200).send({tasks: taskList})
        }else{
            res.status(400).end()
        }
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

const getTask = async(req, res) =>{
    const user_name = req.body.user_name
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
        console.log(e)
        res.status(500).send(e.message)
    }
}

const createTask = async(req, res) =>{
    const user_name = req.body.user_name
    let task = req.body.task
    task.user_name = user_name
    // task_idのリスト
    const before_tasks = req.body.before_tasks

    console.log("create task")
    try{
        const result = await Task.saveTask(task, before_tasks)
        task.task_id = result['insertId']
        if(before_tasks.length > 0){
            await TaskService.modifyTask(task)
        }
        res.status(200).end()
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

const updateTask = async(req, res) => {
    const user_name = req.body.user_name
    let task = req.body.task
    const task_id = req.params.task_id
    task.task_id = task_id
    task.user_name = user_name
    // task_idのリスト
    const deleted_before_tasks = req.body.deleted_before_tasks
    const added_before_tasks = req.body.added_before_tasks
    try{
        let circulateTaskList = await Promise.all(added_before_tasks.map(async(beforeTaskId) => {
            const isCirculate = await TaskService.checkTaskCirculation(beforeTaskId, task.task_id)
            if(isCirculate){ return beforeTaskId }
            return null
        }))
        circulateTaskList =  circulateTaskList.filter(e => e)
        if(circulateTaskList > 0){
            res.status(400).send({circulate_task: circulateTaskList})
        }else{
            const result = await Task.updateTask(task, added_before_tasks, deleted_before_tasks)
            await TaskService.modifyTask(task)
            res.status(200).end()
        }
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

const deleteTask = async(req, res) =>{
    const user_name = req.body.user_name
    const task_id = req.params.task_id

    try{
        const result = await Task.deleteTask(user_name, task_id)
        if(result){
            res.status(200).end()
        }else{
            res.status(400).end()
        }
    }catch(e){
        console.log(e)
        res.status(500).send(e.message)
    }
}

module.exports = {
    getTaskList: getTaskList,
    getAllTaskList: getAllTaskList,
    getTask: getTask,
    createTask: createTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
}