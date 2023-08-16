let mysql = require("mysql");

export default class SQLManager {
    constructor() {
        this.connection = mysql.createConnection( {
            host: 'localhost',
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: 'skinimages'
        });
    }

    saveIntoMetadata(data) {
        this.connection.connect();
        let query = "insert ignore into Cases (case_id, age, sex, history, user_selected_entity, size, severity) values " +
            `(${data.caseID}, ${data.age}, ${data.sex}, ${data.history}, ${data.userEntity}, ${data.size}, ${data.severity})`;
        this.connection.query(query,  (error, results, field) => {
            if (error) throw error;
            console.log(results);
        });
        this.connection.end();
    }
}