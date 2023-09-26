const TaskRepository = require("../repositories/TaskRepository")

const secondsInADay = 24*60*60*1000

// 修正が必要なタスクのIDと修正後の締め切りを返す
// {task_id, deadline}
const needModify = async(targetTask) => {
    const afterTasks = await TaskRepository.findAfterTasks(targetTask.task_id)
    const modifiedDeadlineList = afterTasks.map((afterTask) => {
        const diff = calcDiffDays(targetTask, afterTask)
        if (diff < afterTask.required_days){
            return new Date(new Date(afterTask.deadline) - afterTask.required_days*secondsInADay)
        }else{
            return null
        }
    })
    const modifiedDeadline = modifiedDeadlineList.reduce((d1, d2) => new Date(Math.min(d1, d2)))

    const beforeTasks = await TaskRepository.findBeforeTasks(targetTask.task_id)
    const needModifyTask = beforeTasks.map((task)=>{
        return needModify(task)
    }).reduce((a,b)=>mergeDeadlineObject(a,b))
    needModifyTask[targetTask.task_id] = modifiedDeadline

    return needModifyTask
}

// 前のタスクと後ろのタスクの締め切りの差を取得
const calcDiffDays = async(beforeTask, afterTask) => {
    const beforeTaskDeadline = new Date(beforeTask.deadline)
    const afterTaskDeadline = new Date(afterTask.deadline)
    return (afterTaskDeadline - beforeTaskDeadline)/secondsInADay
}

// objectは{task_id,　更新後の締め切り}
// 同じkeyがあった場合は,締め切りが早いほうを保持
const mergeDeadlineObject = (obj1, obj2) => {
    let obj = Object.assign({}, obj1)
    for (let i in obj2){
        if(i in obj){
            obj[i] = new Date(Math.min(obj[i], obj2[i]))
        }else{
            obj[i] = obj2[i]
        }
    }
    return obj
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
    needModify:needModify,
    checkTaskCirculation: checkTaskCirculation,
}