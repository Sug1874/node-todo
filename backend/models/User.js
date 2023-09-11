const UserRepository = require("../repositories/UserRepository")
const UserService = require("../services/UserService")

const authenticate = async(userName, password) => {
    const user = await UserRepository.find(userName)
    if(user && user.password == password){
        return true
    }else{
        return false
    }
}

const createUser = async(userName, password) => {
    if(await UserService.exist(userName)){
        return false
    }
    await UserRepository.save(userName, password)
    return true
}

module.exports = {
    authenticate: authenticate,
    createUser: createUser
}