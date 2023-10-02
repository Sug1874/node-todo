const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser")
const cors = require("cors")
const jwt = require("jsonwebtoken")

// routers
const loginRouter = require("./routes/login");
const userRouter = require("./routes/user")
const taskReouter = require("./routes/task")


var app = express();

// POSTのbodyを読み込めるようにする
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
})); 

app.use(cors())

// session
const sessionOption = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30*60*1000
    }
}
app.use(session(sessionOption))

// ルーティング
app.use("/login", loginRouter)
app.use("/user", userRouter)
app.use("/task", taskReouter)

var server = app.listen(3000, () => {
    console.log("Node.js is listening to PORT:" + server.address().port);
})