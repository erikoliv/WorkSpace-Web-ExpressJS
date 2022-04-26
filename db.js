const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'workspace.cd77ovbthozc.sa-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Qwe123123qwe',
    database: 'embraer_workspace'
});

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;

