import mysql from 'mysql2/promise'
import fs from 'fs'

//connect mysql database

const connectDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            ssl: {
                ca: fs.readFileSync("ca.pem") // its a file from the online mysql provider it should be in root folder , just download from the dashboard -named ssl
            },
            database: "netflix"
        })

        console.log("MySql connected Successfully")
        return connection
    } catch (error) {
        console.log("Something went wrong while connecting to database, details: ", error)
    }
}

export default connectDB;



