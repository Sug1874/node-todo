import { TaskOutline } from "../../../api"

const ListItem = (props: {task: TaskOutline, clickHandler: (task_id:number)=>void, actionText: string}) => {
    const clickHandler = () => {
        if(props.task.task_id == null ) return
        props.clickHandler(props.task.task_id)
    }
    return (
        <tr>
            <td>{props.task.title}</td>
            <td>{props.task.required_days}</td>
            <td>{props.task.deadline}</td>
            <td onClick={clickHandler}>{props.actionText}</td>
        </tr>
    )
}

export default ListItem