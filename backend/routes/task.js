const TaskController = require("../controllers/TaskController")
const UserService = require("../services/UserService")
const jwt = require("jsonwebtoken")
const conf = require("config")

const router = require("express").Router()

router.use((req,res,next)=>{
    if(!req.headers.authorization){
        res.status(401).send("user is not authenticated")
        return
    }
    const token = req.headers.authorization.split(" ")[1]
    if(!token){
        res.status(401).send("user is not authenticated")
        return
    }
    try{
        const secret_key = conf.jwtSecretKey
        const decoded = jwt.verify(token, secret_key)
        if(UserService.exist(decoded.user_name)){
            req.body.user_name = decoded.user_name
            next()
        }else{
            res.status(401).send("user is not exist")
            return
        }
    }catch(error){
        res.status(401).send("user is not authenticated")
        return
    }
})

// get all task list
router.get("/list/all", TaskController.getAllTaskList)

// get task list
router.get("/list/:pageNum", TaskController.getTaskList)

// get task
router.get("/:task_id", TaskController.getTask)

// create new task
router.post("/", TaskController.createTask)

// update task
router.post("/:task_id", TaskController.updateTask)

// delete task
router.delete("/:task_id", TaskController.deleteTask)

module.exports = router