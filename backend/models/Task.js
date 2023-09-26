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

const saveTask = async(task) => {
    if(task.task_id){ // update
        await TaskRepository.update(task)
    }else{ // create
        await TaskRepository.save(task)
    }
}

const deleteTask = async(user_name, task_id) => {
    const task = await TaskRepository.find(task_id)
    if(!task || task.user_name != user_name){
        return false
    }
    await TaskRepository.remove(task_id)
    return true
}

const modifyTask = async(task_id) => {
    
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
    deleteTask: deleteTask,
    modifyTask: modifyTask,
    getBeforeTasks: getBeforeTasks,
    saveBeforeTasks: saveBeforeTasks
}