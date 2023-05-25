const mysql = require("mysql2/promise");
let connection;
connect();

async function connect() {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'wasd8064.MSL',
        database: 'skinimages'
    });
}

async function postQuery(query) {
    let [rows, fields] = await connection.execute(query);
    return rows;
}

async function select(values, from, where="true") {
    let query = `SELECT ${values} FROM ${from} WHERE ${where};`;
    return await postQuery(query);
}

async function insert(into, values) {
    let valueHeaders = Object.keys(values).join();
    let valueBody = Object.values(values).join();
    let query = `INSERT IGNORE INTO ${into} (${valueHeaders}) VALUES (${valueBody});`
    console.log(query);
    return await postQuery(query);
}

module.exports = {
    postQuery: postQuery,
    insert: insert,
    select: select,
};