import { TaskOutline } from "../../../api"

const ListItem = (props: {task: TaskOutline, clickHandler: (task_id:number)=>void, actionText: string}) => {
    const clickHandler = () => {
        if(props.task.task_id == null ) return
        props.clickHandler(props.task.task_id)
    }
    return (
        <tr>
            <td className="title">{props.task.title}</td>
            <td className="required_days">{props.task.required_days}</td>
            <td className="deadline">{props.task.deadline}</td>
            <td className="action" onClick={clickHandler}><button>{props.actionText}</button></td>
        </tr>
    )
}

export default ListItem