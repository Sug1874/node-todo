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

const find = async(taskId) => {
    var client = await createConnection()
    const [rows, fields] = await client.execute(
        `SELECT * FROM task\
        WHERE task_id = ${taskId}`
    )
    await client.end()
    if(rows.length < 1) return null

    return {
        task_id: taskId,
        user_name: rows[0].user_name,
        title: rows[0].title,
        description: rows[0].description,
        requireed_days: rows[0].required_days,
        deadline: rows[0].deadline
    }
}

const findAll= async(userName) => {
    var client = await createConnection()
    const [rows, fields] = await client.execute(
        `SELECT * FROM task\
        WHERE user_name = '${userName}'`
    )
    await client.end()
    let tasks = rows.map((row)=>{
        return {
            task_id: row.task_id,
            title: row.title,
            required_days: row.required_days,
            deadline: row.deadline
        }
    })
    return tasks
}

const save = async(task) => {
    var client = await createConnection()
    let queryString;
    queryString = `INSERT INTO task (user_name, title, descriptyion, required_days, deadline) \
    VALUES ('${task.user_name}', '${task.title}', '${task.description}', ${task.required_days}, '${task.deadline}')`
    const [result, fields] = await client.query(queryString)
    await client.end()
}

const update = async(task) => {
    var client = await createConnection()
    var queryString = `UPDATE task SET title='${task.title}' description = '${task.description}', required_days = ${task.required_days}, deadline='${task.deadline}' \
    WHERE task_id = ${work.id} and user_name='${task.user_name}'`
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


module.exports = {
    save: save,
    update: update,
    remove: remove,
    find: find,
    findAll:findAll,
    findNotYet: findNotYet
}