const mysql = require('mysql2');

// Create a connection pool instead of a single connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appdev_project_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the pool by getting a connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
    connection.release(); // Release the connection back to the pool
});

module.exports = db;