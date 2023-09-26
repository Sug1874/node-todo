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

const find = async(task_id) => {
    var connection = await createConnection()
    const [rows, fields] = await connection.execute(
        `SELECT * FROM task\
        WHERE task_id = ${task_id}`
    )
    await connection.end()
    if(rows.length < 1) return null

    return {
        task_id: task_id,
        user_name: rows[0].user_name,
        title: rows[0].title,
        description: rows[0].description,
        requireed_days: rows[0].required_days,
        deadline: rows[0].deadline
    }
}

const findAll= async(user_name) => {
    var connection = await createConnection()
    const [rows, fields] = await connection.execute(
        `SELECT * FROM task\
        WHERE user_name = '${user_name}'`
    )
    await connection.end()
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

const save = async(task, before_tasks) => {
    let result, fields;
    var connection = await createConnection()
    await connection.beginTransaction()
    try{
        let queryString = `INSERT INTO task (user_name, title, description, required_days, deadline) \
        VALUES ('${task.user_name}', '${task.title}', '${task.description}', ${task.required_days}, '${task.deadline}')`
        [result, fields] = await connection.query(queryString)

        let task_id = result['insertId']
        before_tasks.map(async (before_task) => {
            await connection.query(`INSERT INTO task_order (after_task_id, before_task_id) VALUES (${task_id}, ${before_task.task_id})`)
        })
        await connection.commit()
    }catch(error){
        await connection.rollback()
        return error
    }finally{
        await connection.end()
    }
    return result
}

const update = async(task, added_before_tasks, deleted_before_tasks) => {
    let result, fields;
    var connection = await createConnection()
    await connection.beginTransaction()
    try{
        let queryString = `UPDATE task SET title='${task.title}' description = '${task.description}', required_days = ${task.required_days}, deadline='${task.deadline}' \
        WHERE task_id = ${task.task_id} and user_name='${task.user_name}'`
        [result, fields] = await connection.query(queryString)

        deleted_before_tasks.map(async(before_task)=>{
            await connection.query(`DELETE FROM task_order WHERE after_task_id=${task.task_id}, before_task_id=${before_task.task_id}`)
        })
        added_before_tasks.map(async (before_task) => {
            await connection.query(`INSERT INTO task_order (after_task_id, before_task_id) VALUES (${task_id}, ${before_task.task_id})`)
        })
        await connection.commit()
    }catch(error){
        await connection.rollback()
        return error
    }finally{
        await connection.end()
    }
    return result
}

const remove = async(task_id) => {
    var connection = await createConnection()
    await connection.beginTransaction()
    try{
        let queryString = `DELETE FROM task WHERE task_id = ${task_id}`
        const [result, fields] = await connection.execute(queryString)
        connection.commit()
    }catch(error){
        await connection.rollback()
        return error
    }finally{
        await connection.end()
    }
}

const findBeforeTasks = async(task_id) => {
    const connection = await createConnection()
    const queryString = `SELECT * FROM \
                            (SELECT * FROM task_order WHERE after_task_id = ${task_id}) AS target_task_order \
                            INNER JOIN task
                            ON target_task_order.before_task_id = task.task_id`
    const [rows, fields] = await connection.execute(queryString)
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

const findAfterTasks = async(task_id) => {
    const connection = await createConnection()
    const queryString = `SELECT * FROM \
                            (SELECT * FROM task_order WHERE before_task_id = ${task_id}) AS target_task_order \
                            INNER JOIN task
                            ON target_task_order.after_task_id = task.task_id`
    const [rows, fields] = await connection.execute(queryString)
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

const modifyDeadline = async(task_id, deadline) => {
    var connection = await createConnection()
    var queryString = `UPDATE task SET deadline='${deadline}' WHERE task_id = ${task_id}`
    const [result, fields] = await connection.query(queryString)
    await connection.end()
    return result
}

module.exports = {
    save: save,
    update: update,
    remove: remove,
    find: find,
    findAll:findAll,
    findBeforeTasks: findBeforeTasks,
    findAfterTasks: findAfterTasks,
    modifyDeadline: modifyDeadline
}