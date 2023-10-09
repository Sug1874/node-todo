const TaskRepository = require("../repositories/TaskRepository")

const milliSecondsInADay = 24*60*60*1000

const modifyTask = async(targetTask) => {
    let newDeadlineDict = {}
    let targetTaskNewDeadline = null;
    const afterTasks = await TaskRepository.findAfterTasks(targetTask.task_id)
    if(afterTasks.length > 0){
        const modifiedDeadlineList = afterTasks.map((afterTask) => {
            const diff = calcDiffDays(targetTask, afterTask)
            if (diff < afterTask.required_days){
                return new Date(new Date(afterTask.deadline) - afterTask.required_days*milliSecondsInADay)
            }else{
                return null
            }
        })
        modifiedDeadlineList = modifiedDeadlineList.filter((e)=> e!=null )
        if(modifiedDeadlineList.length > 0){
            targetTaskNewDeadline = modifiedDeadlineList.reduce((d1, d2) => new Date(Math.min(d1, d2)))
            targetTask.deadline = dateToString(targetTaskNewDeadline)
        }
    }
    const beforeTasks = await TaskRepository.findBeforeTasks(targetTask.task_id)
    if(beforeTasks.length>0){
        let newDeadlineDictList = await Promise.all(beforeTasks.map(async(beforeTask)=>{
            let result = await calcNewDeadline(beforeTask, targetTask)
            return result
        }))
        // 締め切りを格納しているobjectの統合
        // 最も早い締め切りが採用される
        newDeadlineDict = newDeadlineDictList.reduce((d1, d2) => mergeDeadlineDict(d1, d2))
    }
    if(targetTaskNewDeadline){
        newDeadlineDict[targetTask.task_id]= targetTaskNewDeadline
    }

    // 新しい締め切りを保存
    await Promise.all(Object.keys(newDeadlineDict).map(async(key)=>{
        let newDeadlineString = dateToString(newDeadlineDict[key])
        await TaskRepository.modifyDeadline(key, newDeadlineString)
    }))
    return newDeadlineDict
}

// 修正後のdeadlineの計算
// プロパティ名がtask_id, 値が新しい締め切りのobjectを返す
const calcNewDeadline = async(beforeTask, afterTask) => {
    const diffDeadline = calcDiffDays(beforeTask, afterTask)
    let newDeadline;
    if(diffDeadline < afterTask.required_days){
        console.log(`task need to be modified (task_id=${beforeTask.task_id})`)
        newDeadline = new Date(new Date(afterTask.deadline) - afterTask.required_days*milliSecondsInADay)
        beforeTask.deadline = dateToString(newDeadline)
    }else{
        newDeadline = null
    }

    if(newDeadline){
        const nextBeforeTasks = await TaskRepository.findBeforeTasks(beforeTask.task_id)
        let newDeadlineDictList = await Promise.all(nextBeforeTasks.map(async(nextBeforeTask)=>{
            let result = await calcNewDeadline(nextBeforeTask, beforeTask)
            return result
        }))
        // 締め切りを格納しているobjectの統合
        // 最も早い締め切りが採用される
        let newDeadlineDict = (newDeadlineDictList.length > 0) ? newDeadlineDictList.reduce((d1, d2) => mergeDeadlineDict(d1, d2)) : {}
        newDeadlineDict[beforeTask.task_id] = newDeadline
        return newDeadlineDict
    }else{
        return {}
    }
}

// 前のタスクと後ろのタスクの締め切りの差を取得
const calcDiffDays = (beforeTask, afterTask) => {
    const beforeTaskDeadline = new Date(beforeTask.deadline)
    const afterTaskDeadline = new Date(afterTask.deadline)
    return (afterTaskDeadline - beforeTaskDeadline)/milliSecondsInADay
}

const mergeDeadlineDict = (dict1, dict2) => {
    let newDict = Object.assign({}, dict1)
    for (let i in dict2){
        if(i in newDict){
            newDict[i] = new Date(Math.min(newDict[i], dict2[i]))
        }else{
            newDict[i] = dict2[i]
        }
    }
    return newDict
}

// タスク順序に循環があったらtrue
const checkTaskCirculation = async(beforeTaskId, afterTaskId) => {
    const nextBeforeTasks = await TaskRepository.findBeforeTasks(beforeTaskId)
    let check = false

    check = nextBeforeTasks.map((nextBeforeTask)=>{
        if(nextBeforeTask.task_id == afterTaskId){
            return true
        }
        return false
    }).some(e=>e)

    if(!check){
        const checkList = await Promise.all(nextBeforeTasks.map(async(nextBeforeTask)=>{
            let result = await checkTaskCirculation(nextBeforeTask.task_id, afterTaskId)
            return result
        }))
        check = checkList.some(e=>e)
    }
    return check
}

// Date型をyyyy-MM-ddの形の
const dateToString = (date) =>{
    return `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2,'0')}`
}

module.exports={
    modifyTask: modifyTask,
    checkTaskCirculation: checkTaskCirculation,
}