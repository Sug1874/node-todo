const router = require("express").Router()
const UserController = require("../controllers/UserController")

// ユーザー作成
router.post("/new", UserController.createUser)

module.exports = router