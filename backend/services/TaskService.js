const TaskRepository = require("../repositories/TaskRepository")

const milliSecondsInADay = 24*60*60*1000

// 必要ならばタスクのdeadlineを修正
const modifyTask = async(targetTask) => {
    const newDeadline = await calcNewDeadline(targetTask)
    if(newDeadline){
        await TaskRepository.modifyDeadline(targetTask.task_id, newDeadline)
    }

    const beforeTasks = await TaskRepository.findBeforeTasks(targetTask.task_id)
    beforeTasks.map(async(task)=>{
        await modifyTask(task)
    })
}

// 修正後のdeadlineの計算
// 修正の必要がなければnullを返す
const calcNewDeadline = async(targetTask) => {
    const afterTasks = await TaskRepository.findAfterTasks(targetTask.task_id)
    const modifiedDeadlineList = afterTasks.map((afterTask) => {
        const diff = calcDiffDays(targetTask, afterTask)
        if (diff < afterTask.required_days){
            return new Date(new Date(afterTask.deadline) - afterTask.required_days*milliSecondsInADay)
        }else{
            return null
        }
    })
    const modifiedDeadline = modifiedDeadlineList.reduce((d1, d2) => new Date(Math.min(d1, d2)))
    return modifiedDeadline
}

// 前のタスクと後ろのタスクの締め切りの差を取得
const calcDiffDays = async(beforeTask, afterTask) => {
    const beforeTaskDeadline = new Date(beforeTask.deadline)
    const afterTaskDeadline = new Date(afterTask.deadline)
    return (afterTaskDeadline - beforeTaskDeadline)/milliSecondsInADay
}

// タスク順序に循環があったらtrue
const checkTaskCirculation = async(beforeTask, afterTask) => {
    const beforeTasks = await TaskRepository.findBeforeTasks(afterTask.task_id)
    let check = false
    for (let task in beforeTasks){
        if(task.task_id == beforeTask.task_id){
            check = true
            break
        }
    }
    if(!check){
        for (let task in beforeTasks){
            check = checkTaskCirculation(beforeTask, task)
            if(check){ break }
        }
    }
    return check
}

module.exports={
    modifyTask: modifyTask,
    checkTaskCirculation: checkTaskCirculation,
}