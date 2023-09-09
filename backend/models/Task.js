const getTaskList = async(userName, pageNum) => {

}

const getTask = async(userName, workId) => {

}

const saveTask = async(task) => {
    if(task.task_id){ // update

    }else{ // create

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