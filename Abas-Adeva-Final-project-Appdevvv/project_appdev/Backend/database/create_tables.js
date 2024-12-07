const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

// Create connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'appDev_project_ecommerce',
    multipleStatements: true // Important for running multiple SQL statements
});

// Read SQL file
const sqlFile = path.join(__dirname, 'order_tables.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Execute SQL commands
connection.query(sql, (err, results) => {
    if (err) {
        console.error('Error creating tables:', err);
        return;
    }
    console.log('Tables created successfully!');
    connection.end();
});
