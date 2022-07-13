const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'database'
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;

