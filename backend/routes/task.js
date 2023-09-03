const TaskController = require("../controllers/TaskController")

const router = require("express").Router()

// session
router.use((req,res,next)=>{
    if (!req.session.user_name) {
        res.status(401).send("user is not authenticated")
    }
    next()
})

// get task list
router.get("/list/:pageNum", TaskController.getTaskList)

// get task
router.get("/:taskId", TaskController.getTask)

// create new task
router.post("/", TaskController.createTask)

// update task
router.post("/:taskId", TaskController.updateTask)

// delete task
router.delete("/:taskId", TaskController.deleteTask)

// modify tasks deadline
router.post("/:modify", TaskController.modifyTasks)

module.exports = router