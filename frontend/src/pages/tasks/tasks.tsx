import { useEffect, useState } from "react"
import { TaskOutline, getAllTaskList } from "../../api"
import TaskList from "./parts/taskList"
import { useNavigate } from "react-router-dom"

const ListPage = () => {
    const TASK_IN_PAGE = 10

    const [pageNum, setPageNum] = useState(0)
    const [taskList, setTaskList] = useState<TaskOutline[]>([])
    const [taskListToShow, setTaskListToShow] = useState<TaskOutline[]>([])
    const [nextDisable, setNextDisable] = useState(false)
    const [prevDisable, setPrevDisable] = useState(false)

    const navigation = useNavigate()

    const prevPage = () => {
        if(pageNum > 0){
            setPageNum(prevState => prevState-1)
        }
    }

    const nextPage = () => {
        setPageNum(prevState => prevState+1)
    }

    const listItemClicked = (task_id: number) => {
        navigation(`/task/${task_id}`)
    }

    useEffect(() => {
        getAllTaskList()
            .then((result) => {
                if(result.status == 200 ){
                    let tasks:TaskOutline[] = result.body.tasks
                    // タスクのリストを更新
                    setTaskList(tasks)
                }else if(result.status == 401){
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

    useEffect(() => {
        console.log(pageNum)
        // 1ページ目の場合prevボタンを無効にする
        if(pageNum <= 0){
            setPrevDisable(true)
        }else{
            setPrevDisable(false)
        }
        // これ以上タスクがない場合nextボタンを無効にする
        if(taskList.length <= (pageNum+1)*TASK_IN_PAGE){
            setNextDisable(true)
        }else{
            setNextDisable(false)
        }

        setTaskListToShow(taskList.slice(pageNum*TASK_IN_PAGE, (pageNum+1)*TASK_IN_PAGE))
        // タスクのリストを更新
    }, [pageNum, taskList])

    return (
        <div className="content_wrapper">
            <button onClick={()=>{navigation('/task/new')}}>create new task</button>
            <TaskList tasks={taskListToShow} addButtonClickHandler={ null } itemClickHandler={listItemClicked} listActionText="detail"/>
            <div className="button_wrapper">
                <button disabled={prevDisable} onClick={prevPage}>prev</button>
                <span>{pageNum+1}</span>
                <button disabled={nextDisable} onClick={nextPage}>next</button>
            </div>
        </div>
    )
}

export default ListPage