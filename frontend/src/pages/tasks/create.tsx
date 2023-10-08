import { useCallback, useContext, useEffect, useState } from "react"
import { TaskDetail, TaskOutline, createNewTask, getAllTaskList } from "../../api"
import TaskList from "./parts/taskList"
import { useNavigate } from "react-router-dom"
import useModal from "../../hooks/useModal"

const CreatePage = () => {
    const [taskDetail, setTaskDetail] = useState<TaskDetail>({
        task_id: -1,
        user_name: "",
        title: "",
        description: "",
        required_days: 0,
        deadline: ""
    })

    const [userTasks, setUserTasks] = useState<TaskOutline[]>([])
    const [beforeTaskIds, setBeforeTaskIds] = useState<number[]>([])

    const navigation = useNavigate()

    useEffect(() => {
        getAllTaskList()
            .then((result) => {
                if(result.status == 200 ){
                    let tasks:TaskOutline[] = result.body.tasks
                    // タスクのリストを更新
                    setUserTasks(tasks)
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

        if(task.title.length < 1 || 
            task.description.length < 1 || 
            task.required_days < 1 || 
            task.deadline.length < 1 ){
                alert("入力が完了していません")
                return
        }

        createNewTask(task, before_tasks)
            .then((result) => {
                switch(result.status){
                    case 200:
                        alert("タスクを保存しました")
                        navigation("/")
                        break
                    case 401:
                        navigation("/user/login")
                        break
                    default :
                        alert("タスクの保存に失敗しました")
                        break
                }
            })
            .catch((error) => {
                alert("タスクの保存に失敗しました")
            })
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
        <div className="content_wrapper">
            <div className="top_button_wrapper"><a href="/"><button>タスク一覧へ</button></a></div>
            <div className="detail_item">
                <span>タイトル</span>
                <input type="text" name="title" placeholder="タイトル" onChange={titleChangeHandler}/>
            </div>
            <div className="detail_item">
                <span>詳細</span>
                <textarea name="description" rows={10} cols={25} placeholder="タスクの内容" onChange={descriptionChangeHandler} />
            </div>
            <div className="detail_item">
                <span>作業日数</span>
                <input type="" name="required_days" placeholder="作業日数" onChange={requiredDaysChangeHandler} />
            </div>
            <div className="detail_item">
                <span>締め切り</span>
                <input type="date" name="deadline" placeholder="" onChange={deadlineChangeHandler} />
            </div>
            <div className="detail_item">
                <span>前のタスク</span>
                <TaskList tasks={getTaskOutlineInBeforeTasks(beforeTaskIds)} addButtonClickHandler={openModal} itemClickHandler={removeBeforeTask} listActionText="remove"/>
                <Modal><TaskList tasks={getTaskOutlineNotInBeforeTasks(beforeTaskIds)} addButtonClickHandler={null} itemClickHandler={addBeforeTask} listActionText="add"/></Modal>
            </div>
            <div className="button_wrapper">
                <button onClick={saveButtonClicked}>タスクを保存</button>
            </div>
        </div>
    )
}

export default CreatePage