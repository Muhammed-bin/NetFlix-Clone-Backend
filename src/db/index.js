import mysql from 'mysql2/promise'

//connect mysql database

try {
    const connection = await mysql.createConnection({
        host: "",
        user: "",
        password: "",
        database: ""
    })
} catch (error) {
    console.log("Something went wrong while connecting to database, details: ",error)
}