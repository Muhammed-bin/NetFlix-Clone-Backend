import pool from "../db/index.js";
// const createTable = async () => {
//     const connection = await connectDB()

//     const createTableQuary = `CREATE TABLE users (
//   id INT PRIMARY KEY AUTO_INCREMENT,
//   email VARCHAR(255) UNIQUE NOT NULL,
//   username VARCHAR(100) UNIQUE NOT NULL,
//   fullName VARCHAR(255) NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   avatar VARCHAR(500),
//   refreshToken TEXT,
//   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
// );`

//     await connection.query(createTableQuary)
//     console.log("Table created")
//     await connection.end()
// }

// createTable()


const createUser = async(userData)=>{
    const {username,email,fullName,password,avatar} = userData;
    const [result] = await pool.query(`
        INSERT INTO users(username,email,fullName,password,avatar) values(?,?,?,?,?)`,[username,email,fullName,password,avatar])
    console.log(result)
    return result.insertId;
    
}

const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    console.log(rows)
    return rows;
}


const findById = async (id) => {
    const [result] = await pool.query(`SELECT * FROM users WHERE id = ?`,[id])
    return result
}

const findOneUser = async (email,username)=>{
    //we can use if condition to check which one is passed
    const [result] = await pool.query(`SELECT * FROM users WHERE email = ? OR username = ?`,[email,username])
    console.log(result)
    return result;
}


const updateUserRefreshToken = async (userId,refreshToken)=>{
    const [result] = await pool.query(`UPDATE users SET refreshToken = ? WHERE id = ? `,[refreshToken,userId])
    return result
}


export {
    createUser,
    findAll,
    findOneUser,
    updateUserRefreshToken,
    findById
}