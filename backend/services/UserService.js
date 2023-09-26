const UserRepository = require("../repositories/UserRepository")

const exist = async(user_name) => {
    const user = await UserRepository.find(user_name)
    if(user){
        return true
    }else{
        return false
    }
}

module.exports = {
    exist: exist
}