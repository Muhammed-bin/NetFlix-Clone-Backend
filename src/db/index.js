import mysql from 'mysql2/promise'
import fs from 'fs'



const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: {
        ca: fs.readFileSync("ca.pem") // its a file from the online mysql provider it should be in root folder , just download from the dashboard -named ssl
    },
    database: "netflix",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})


console.log("MySql connected Successfully")

export default pool;



