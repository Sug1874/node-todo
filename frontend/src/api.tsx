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

export type TaskDetail = {
    task_id: number|null,
    user_name: string,
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
    if(responseStatus == 200){
        const responseJson = await response.json()
        const token = responseJson.token
        localStorage.setItem("token", token)
    }
    return responseStatus
}

export const getAllTaskList = async():Promise<{status: number, body: any}> => {
    const response = await fetch(`${TASK_LIST_URL}/all`,{
        method: "GET",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    if(response.status == 200){
        const responseBody = await response.json()
        return {
            status: response.status,
            body: responseBody,
        }
    }else{
        return {
            status: response.status,
            body: null
        }
    }
}

export const getTaskDetail = async(task_id: number):Promise<{status: number, body: any}> => {
    const response = await fetch(`${CRUD_TASK_URL}/${task_id}`,{
        method: "GET",
        headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    if(response.status == 200){
        const responseBody = await response.json()
        return {
            status: response.status,
            body: responseBody,
        }
    }else{
        return {
            status: response.status,
            body: null
        }
    }
}

export const createNewTask = async(task: TaskDetail, beforeTasks: number[]) => {
    const response = await fetch(CRUD_TASK_URL, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            task: task,
            before_tasks: beforeTasks
        }),
    })
    if(response.status == 200){
        return {
            status: response.status,
        }
    }else{
        return {
            status: response.status,
        }
    }
}

export const updateTask = async(task: TaskDetail, addedBeforeTasks: number[], deletedBeforeTasks: number[]) => {
    const response = await fetch(`${CRUD_TASK_URL}/${task.task_id}`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            task: task,
            added_before_tasks: addedBeforeTasks,
            deleted_before_tasks: deletedBeforeTasks
        }),
    })
    console.log(response)
    if(response.status == 200){
        return {
            status: response.status,
            body: null,
        }
    }else if(response.status == 400){
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

export const deleteTask = async(task_id: number):Promise<{status: number}> => {
    const response = await fetch(`${CRUD_TASK_URL}/${task_id}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    return {
        status: response.status
    }
}