import { useState } from "react"
import { TaskOutline } from "../../../api"
import ListItem from "./listItem"

const TaskList = (
    props: {
        tasks: Array<TaskOutline>, 
        addButtonClickHandler: (()=>void)|null,
        itemClickHandler: (task_id:number)=>void,
        listActionText: string
    }
) => {
    return (
        <table>
            <thead>
                <th>タイトル</th>
                <th>作業日数</th>
                <th>締め切り</th>
                <th></th>
            </thead>
            <tbody>
                {props.tasks.map((item) => <ListItem task={item} clickHandler={props.itemClickHandler} actionText={props.listActionText}/>)}
                {props.addButtonClickHandler && (<tr><td colSpan={3}>+</td></tr>)}
            </tbody>

        </table>
    )
}

export default TaskList
