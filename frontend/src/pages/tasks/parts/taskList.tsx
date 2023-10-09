import { memo, useState } from "react"
import { TaskOutline } from "../../../api"
import ListItem from "./listItem"

type TaskListProps = {
    tasks: Array<TaskOutline>, 
    addButtonClickHandler: (()=>void)|null,
    itemClickHandler: (task_id:number)=>void,
    listActionText: string
}

const TaskList = memo<TaskListProps>((props) => {
    return (
        <table>
            <thead>
                <th className="title">タイトル</th>
                <th className="required_days">作業日数</th>
                <th className="deadline">締め切り</th>
                <th className="action">&nbsp;</th>
            </thead>
            <tbody>
                {props.tasks.map((item) => <ListItem task={item} clickHandler={props.itemClickHandler} actionText={props.listActionText}/>)}
                {props.addButtonClickHandler && (<tr className="table_add_button" onClick={props.addButtonClickHandler}><td colSpan={4}>  +  </td></tr>)}
            </tbody>

        </table>
    )
})

export default TaskList
