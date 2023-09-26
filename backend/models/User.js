const UserRepository = require("../repositories/UserRepository")
const UserService = require("../services/UserService")

const authenticate = async(user_name, password) => {
    const user = await UserRepository.find(user_name)
    if(user && user.password == password){
        return true
    }else{
        return false
    }
}

const createUser = async(user_name, password) => {
    if(await UserService.exist(user_name)){
        return false
    }
    await UserRepository.save(user_name, password)
    return true
}

module.exports = {
    authenticate: authenticate,
    createUser: createUser
}