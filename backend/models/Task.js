const TaskRepository = require("../repositories/TaskRepository")

const getTaskList = async(user_name, pageNum) => {
    const taskNumInPage = 10
    const tasks = await TaskRepository.findAll(user_name)
    if(pageNum < 0){
        return [0, []]
    }
    return [tasks.length, tasks.slice(taskNumInPage*pageNum, taskNumInPage*(pageNum+1))]
}

const getAllTaskList = async(user_name) => {
    const tasks = await TaskRepository.findAll(user_name)
    return tasks
}

const getTask = async(user_name, task_id) => {
    const task = await TaskRepository.find(task_id)
    if(user_name != task.user_name){
        return null
    }
    return task
}

const saveTask = async(task, before_tasks) => {
    const result = await TaskRepository.save(task, before_tasks)
    return result
}

const updateTask = async(task, added_before_tasks, deleted_before_tasks) => {
    return await TaskRepository.update(task, added_before_tasks, deleted_before_tasks)
}

const deleteTask = async(user_name, task_id) => {
    const task = await TaskRepository.find(task_id)
    if(!task || task.user_name != user_name){
        return false
    }
    await TaskRepository.remove(task_id)
    return true
}

const getBeforeTasks = async(task_id) => {
    const tasks = await TaskRepository.findBeforeTasks(task_id)
    return tasks
}

module.exports = {
    getTaskList: getTaskList,
    getAllTaskList: getAllTaskList,
    getTask: getTask,
    saveTask: saveTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    getBeforeTasks: getBeforeTasks,
}