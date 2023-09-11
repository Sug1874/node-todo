const TaskRepository = require("../repositories/TaskRepository")

const getTaskList = async(userName, pageNum) => {
    const taskNumInPage = 10
    const tasks = await TaskRepository.findAll(userName)
    if(pageNum < 0){
        return []
    }
    return tasks.slice(taskNumInPage*pageNum, taskNumInPage*(pageNum+1))
}

const getTask = async(userName, taskId) => {
    const task = await TaskRepository.find(taskId)
    if(userName != task.user_name){
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

const deleteTask = async(taskId) => {
    
}

const modifyTask = async(taskId) => {
    
}

module.exports = {
    getTaskList: getTaskList,
    getTask: getTask,
    saveTask: saveTask,
    deleteTask: deleteTask
}