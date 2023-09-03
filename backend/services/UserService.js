const UserRepository = require("../repositories/UserRepository")

const exist = async(userName) => {
    const user = await UserRepository.find(userName)
    if(user){
        return true
    }else{
        return false
    }
}

module.exports = {
    exist: exist
}