const router = require("express").Router()
const UserController = require("../controllers/UserController")

router.post("/", UserController.login)

module.exports = router