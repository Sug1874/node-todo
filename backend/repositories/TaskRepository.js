const conf = require("config")
const mysql = require("mysql2/promise")

const createConnection = async() => {
    return await mysql.createConnection({
        host: conf.dbHost,
        port: conf.dbPort,
        user: conf.dbUser,
        password: conf.dbPassword,
        database: conf.dbName, 
        dateStrings: true
    })
}

const save = async(task) => {
    var client = await createConnection()
    let queryString;
    queryString = `INSERT INTO task (descriptyion, work_id) VALUES ('${task.description}', ${task.workId})`
    const [result, fields] = await client.query(queryString)
    await client.end()
}

const update = async(task) => {
    var client = await createConnection()
    var queryString = `UPDATE task SET description = ${task.description}, work_id = ${task.workId} WHERE id = ${work.id}`
    const [result, fields] = await client.query(queryString)
    await client.end()
    return result
}

const remove = async(task) => {
    var client = await createConnection()
    let queryString;
    queryString = `DELETE FROM task WHERE id = ${task.id}`
    const [result, fields] = await client.execute(queryString)
    await client.end()
}

const find = async(id) => {
    var client = await createConnection()
    const [rows, fields] = await client.execute(
        `SELECT * FROM task\
        WHERE id = ${id}`
    )
    await client.end()
    if(rows.length < 1) return null

    var id = rows[0].id
    var description = rows[0].description
    var workId = rows[0].work_id
    return new Task(id, description, workId)
}

const findAll= async(workId) => {
    var client = await createConnection()
    const [rows, fields] = await client.execute(
        `SELECT * FROM task\
        WHERE work_id = ${workId}`
    )
    await client.end()
    let tasks = rows.map((row)=>{
        var id = row.id
        var description = row.description
        var taskUserName = row.user_name
        var workId = row.work_id
        return new Task(id, description, taskUserName, workId)
    })
    return tasks
}

const findNotYet = async(userName) => {
    var client = await createConnection()
    const [rows, fields] = await client.execute(
        `SELECT * FROM task\
        WHERE user_name='${userName}' and work_id is NULL`
    )
    await client.end()
    let tasks = rows.map((row)=>{
        var id = row.id
        var description = row.description
        var taskUserName = row.user_name
        var workId = row.work_id
        return new Task(id, description, taskUserName, workId)
    })
    return tasks
}

module.exports = {
    save: save,
    update: update,
    remove: remove,
    find: find,
    findAll:findAll,
    findNotYet: findNotYet
}