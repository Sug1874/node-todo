var conf = require("config")
var mysql = require("mysql2/promise")

const createConnection = async() => {
    return await mysql.createConnection({
        host: conf.dbHost,
        port: conf.dbPort,
        user: conf.dbUser,
        password: conf.dbPassword,
        database: conf.dbName
    })
}

const save = async(user_name, password) => {
    const client = await createConnection()
    const [result, fields] = await client.query(
        `INSERT INTO user VALUES ('${user_name}', '${password}')`
    )
    await client.end()
}

const find = async(name) => {
    const client = await createConnection()
    const [rows, fields] = await client.execute(
        `SELECT * FROM user WHERE user_name="${name}"`
    )
    await client.end()
    if(rows.length < 1){
        return null
    }
    var user_name = rows[0].user_name
    var password = rows[0].password
    return {
        user_name: user_name,
        password: password
    }
}

module.exports = {
    save: save,
    find: find
}