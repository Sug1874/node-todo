const HOST = "http://localhost:3000"
const USER_REGISTER_URL = `${HOST}/user/new`
const LOGIN_URL = `${HOST}/login`
const TASK_LIST_URL = `${HOST}/task/list`
const CRUD_TASK_URL = `${HOST}/task`

type UserRequestBody = {
    user_name: string,
    password: string
}

type TaskInfo = {
    task_id: number|null,
    title: string,
    description: string,
    required_days: number,
    deadline: string
}

const registerUser = async(body:UserRequestBody) => {
    const result = await fetch(USER_REGISTER_URL)
    const resultJson = result.json()
}

const loginUser = async(body: UserRequestBody) => {

}

const getTaskList = async(pageNum: number) => {}

const getTaskDetail = async(task_id: number) => {}

const createNewTask = async(task: TaskInfo) => {}

const updateTask = async(task: TaskInfo) => {}

const deleteTask = async(task_id: number) => {}

export default {
    registerUser: registerUser,
    loginUser: loginUser,
    getTaskList: getTaskList,
    getTaskDetail: getTaskDetail,
    createNewTask: createNewTask,
    updateTask: updateTask,
    deleteTask: deleteTask
}