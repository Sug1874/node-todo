const TaskRepository = require("../repositories/TaskRepository")

const getTaskList = async(user_name, pageNum) => {
    const taskNumInPage = 10
    const tasks = await TaskRepository.findAll(user_name)
    if(pageNum < 0){
        return []
    }
    return tasks.slice(taskNumInPage*pageNum, taskNumInPage*(pageNum+1))
}

const getTask = async(user_name, task_id) => {
    const task = await TaskRepository.find(task_id)
    if(user_name != task.user_name){
        return null
    }
    return task
}

const saveTask = async(task, before_tasks) => {
    await TaskRepository.save(task, before_tasks)
}

const updateTask = async(task, added_before_tasks, deleted_before_tasks) => {
    await TaskRepository.update(task, added_before_tasks, deleted_before_tasks)
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

const saveBeforeTasks = async(task_id, beforeTasks) => {

}

module.exports = {
    getTaskList: getTaskList,
    getTask: getTask,
    saveTask: saveTask,
    updateTask: updateTask,
    deleteTask: deleteTask,
    getBeforeTasks: getBeforeTasks,
    saveBeforeTasks: saveBeforeTasks
}