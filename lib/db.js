const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'midnanae',
  password: '',
});
connection.connect();
module.exports = connection;