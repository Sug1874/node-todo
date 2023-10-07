import { useCallback, useEffect, useState } from "react"
import { TaskDetail, TaskOutline, deleteTask, getAllTaskList, getTaskDetail, updateTask } from "../../api"
import { useNavigate, useParams } from "react-router-dom"
import TaskList from "./parts/taskList"
import useModal from "../../hooks/useModal"

const DetailPage = () => {
    const navigation = useNavigate()
    const urlParams = useParams<{ id: string }>()

    const [taskDetail, setTaskDetail] = useState<TaskDetail>({
        task_id: -1,
        user_name: "user",
        title: "title",
        description: "description",
        required_days: 0,
        deadline: "1970-01-01"
    })

    // 変更前のデータを保持
    const [origData, setOrigData] = useState<TaskDetail>({
        task_id: -1,
        user_name: "user",
        title: "title",
        description: "description",
        required_days: 0,
        deadline: "1970-01-01"
    })

    const [beforeTaskIds, setBeforeTaskIds] = useState<number[]>([])
    const [origBeforeTaskIds, setOrigBeforeTaskIds] = useState<number[]>([])
    const [userTasks, setUserTasks] = useState<TaskOutline[]>([])

    useEffect(()=>{
        if(urlParams.id==undefined){
            alert("task_idが指定されていません")
            return 
        }else{
            const task_id= Number(urlParams.id)
            // タスクの詳細取得
            getTaskDetail(task_id)
                .then((result)=>{
                    if(result.status==200){
                        const task:TaskDetail = result.body.task
                        const before_tasks: number[] = result.body.before_tasks.map((task:any) => task.task_id)
                        setTaskDetail(task)
                        setOrigData(task)
                        setBeforeTaskIds(before_tasks)
                        setOrigBeforeTaskIds(before_tasks)
                    }else if(result.status==400){
                        alert("無効なtask_idです")
                        navigation('/')
                    }else if(result.status==500){
                        alert("タスクの取得に失敗しました。時間をおいてやり直してください")
                        navigation('/')
                    }
                })
                .catch(()=>{
                    alert("タスクの取得に失敗しました。時間をおいてやり直してください")
                    navigation('/')
                })

            // タスク一覧取得
            getAllTaskList()
            .then((result) => {
                if(result.status == 200 ){
                    let tasks:TaskOutline[] = result.body.tasks
                    // タスクのリストを更新
                    setUserTasks(tasks.filter(task => task.task_id != task_id))
                }else if(result.status == 401){
                    alert("タスク一覧の取得に失敗しました。")
                    navigation("/user/login")
                }else if(result.status == 400){
                    alert("タスク一覧の取得に失敗しました。")
                }else if(result.status == 500){
                    alert("タスク一覧の取得に失敗しました。時間をおいてやり直してください。")
                }
            })
            .catch(error => {
                console.log(error)
            })
        }

    }, [])

    const titleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskDetail(prev => {
            return {
                task_id: prev.task_id,
                user_name: prev.user_name,
                title: e.target.value,
                description: prev.description,
                required_days: prev.required_days,
                deadline: prev.deadline
            }
        })
    }

    const descriptionChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTaskDetail(prev => {
            return {
                task_id: prev.task_id,
                user_name: prev.user_name,
                title: prev.title,
                description: e.target.value,
                required_days: prev.required_days,
                deadline: prev.deadline
            }
        })
    }

    const requiredDaysChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskDetail(prev => {
            return {
                task_id: prev.task_id,
                user_name: prev.user_name,
                title: prev.title,
                description: prev.description,
                required_days: Number(e.target.value),
                deadline: prev.deadline
            }
        })
    }

    const deadlineChangeHandler = (e:React.ChangeEvent<HTMLInputElement>) => {
        setTaskDetail(prev => {
            return {
                task_id: prev.task_id,
                user_name: prev.user_name,
                title: prev.title,
                description: prev.description,
                required_days: prev.required_days,
                deadline: e.target.value
            }
        })
    }

    const saveButtonClicked = () => {
        let task = taskDetail
        let before_tasks = beforeTaskIds

        let added_before_tasks = before_tasks.filter(id => !origBeforeTaskIds.includes(id))
        let deleted_before_tasks = origBeforeTaskIds.filter(id => !before_tasks.includes(id))

        console.log(task)

        updateTask(task, added_before_tasks, deleted_before_tasks)
            .then(result => {
                console.log(result)
                switch(result.status){
                    case 200:
                        alert("タスクを保存しました")
                        window.location.reload()
                        break
                    case 400:
                        let circulate_task_ids = result.body.circulate_task
                        break
                    case 401:
                        navigation("/user/login")
                        break
                    case 500:
                        alert("タスクの保存に失敗しました")
                        break
                    default:
                        break
                }
            })
            .catch(error => {

            })
    }

    const cancelButtonClicked = () => {
        setTaskDetail({...origData})
        setBeforeTaskIds([...origBeforeTaskIds])
    }

    const deleteButtonClicked = () => {
        if(taskDetail.task_id == null){
            alert("タスク削除ができません。リロードしてやり直してください。")
        }else{
            deleteTask(taskDetail.task_id)
                .then((result) => {
                    if(result.status == 200){
                        alert("タスクの削除が完了しました")
                        navigation('/')
                    }else if(result.status == 400){
                        alert("無効なtask_idです")
                        navigation('/')
                    }else{
                        alert("タスクの削除に失敗しました。時間をおいてやり直してください")
                    }
                }).catch(error => {
                    alert("タスクの削除に失敗しました。時間をおいてやり直してください")
                })
        }
    }

    const addBeforeTask = useCallback((task_id: number) => {
        setBeforeTaskIds(prev => {
            if(!prev.includes(task_id)){
                return [...prev, task_id]
            }
            return [...prev]
        })
    },[])

    const removeBeforeTask = useCallback((task_id: number) => {
        setBeforeTaskIds(prev => {
            let newList = [...prev]
            let index = newList.indexOf(task_id)
            if(index >= 0){
                newList.splice(index, 1)
            }
            return newList
        })
    },[])

    const getTaskOutlineInBeforeTasks = (taskIds: number[]):TaskOutline[] => {
        let beforeTasks:TaskOutline[] = []
        beforeTasks = userTasks.filter((task) => {return task.task_id ? taskIds.includes(task.task_id) : false})
        return beforeTasks
    }

    const getTaskOutlineNotInBeforeTasks = (taskIds: number[]):TaskOutline[] => {
        let notBeforeTasks:TaskOutline[] = []
        notBeforeTasks = userTasks.filter((task) => {return task.task_id ? !taskIds.includes(task.task_id) : true})
        return notBeforeTasks
    }

    const {Modal, openModal} = useModal()

    return (
        <>
            <input type="text" name="title" value={taskDetail?.title} onChange={titleChangeHandler}/>
            <textarea name="description" rows={10} cols={25} value={taskDetail?.description} onChange={descriptionChangeHandler} />
            <input type="" name="required_days" value={String(taskDetail?.required_days)} onChange={requiredDaysChangeHandler} />
            <input type="date" name="deadline" value={taskDetail?.deadline} onChange={deadlineChangeHandler} />
            <TaskList tasks={getTaskOutlineInBeforeTasks(beforeTaskIds)} addButtonClickHandler={openModal} itemClickHandler={removeBeforeTask} listActionText="remove"/>
            <Modal><TaskList tasks={getTaskOutlineNotInBeforeTasks(beforeTaskIds)} addButtonClickHandler={null} itemClickHandler={addBeforeTask} listActionText="add"/></Modal>
            <div>
                <button onClick={deleteButtonClicked}>タスクを削除</button>
                <button onClick={cancelButtonClicked}>変更をリセット</button>
                <button onClick={saveButtonClicked}>変更を保存</button>
            </div>
        </>
    )
}

export default DetailPage