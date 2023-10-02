import { useNavigate } from "react-router-dom"

const HOST = "http://localhost:3000"
const USER_REGISTER_URL = `${HOST}/user/new`
const LOGIN_URL = `${HOST}/login`
const TASK_LIST_URL = `${HOST}/task/list`
const CRUD_TASK_URL = `${HOST}/task`

type UserRequestBody = {
    user_name: string,
    password: string
}

export type TaskOutline = {
    task_id: number|null,
    title: string,
    required_days: number,
    deadline: string
}

type TaskDetail = {
    task_id: number|null,
    title: string,
    description: string,
    required_days: number,
    deadline: string
}

export const registerUser = async(body:UserRequestBody):Promise<number> => {
    const response = await fetch(USER_REGISTER_URL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    const responseStatus = response.status
    return responseStatus
}

export const loginUser = async(body: UserRequestBody):Promise<number> => {
    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    const responseStatus = response.status
    return responseStatus
}

export const getTaskList = async(pageNum: number):Promise<{status: number, body: any}> => {
    const response = await fetch(`${TASK_LIST_URL}/${pageNum}`,{method: "GET"})
    // return {status: response.status}
    if(response.status == 200){
        const responseBody = await response.json()
        return {
            status: response.status,
            body: responseBody
        }
    }else{
        return {
            status: response.status,
            body: null
        }
    }
}

export const getTaskDetail = async(task_id: number) => {}

export const createNewTask = async(task: TaskDetail) => {}

export const updateTask = async(task: TaskDetail) => {}

export const deleteTask = async(task_id: number) => {}