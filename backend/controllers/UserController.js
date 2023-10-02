const User = require("../models/User")
const jwt = require("jsonwebtoken")
const conf = require("config")

const login = async(req, res) => {
    const user_name = req.body.user_name
    const password = req.body.password
    try{
        const result = await User.authenticate(user_name, password)
        if(result){
            const payload = {
                user_name: user_name
            }
            const secret_key = conf.jwtSecretKey
            const token = jwt.sign(payload, secret_key, {expiresIn: "23h"})
            res.status(200).send({token: token})
        }else{
            res.status(401).send("user name or password is wrong")
        }
    }catch(e){
        res.status(500).send(e.message)
    }
}

const createUser = async(req, res) => {
    const user_name = req.body.user_name
    const password = req.body.password
    try{
        const result = await User.createUser(user_name, password)
        if(result){
            res.status(200).end()
        }else{
            res.status(400).send("this user name is already used")
        }
    }catch(e){
        res.status(500).send(e.message)
    }
}

module.exports = {
    login: login,
    createUser: createUser
}