const TaskController = require("../controllers/TaskController")
const User = require("../models/User")
const UserService = require("../services/UserService")

const router = require("express").Router()

// session
router.use((req,res,next)=>{
    if (!req.session.user_name || !UserService.exist(req.session.user_name)) {
        res.status(401).send("user is not authenticated")
    }
    next()
})

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

// modify tasks deadline
router.post("/:modify", TaskController.modifyTasks)

module.exports = router