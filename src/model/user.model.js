import pool from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
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


const createUser = async (userData) => {
    const { username, email, fullName, password, avatar } = userData;
    const [result] = await pool.query(`
        INSERT INTO users(username,email,fullName,password,avatar) values(?,?,?,?,?)`, [username, email, fullName, password, avatar])
    console.log(result)
    return result.insertId;

}

const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM users');
    console.log(rows)
    return rows;
}


const findById = async (id) => {
    const [result] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id])
    return result[0]
}

const findByIdNoPassAndRefToken = async (id) => {
    const [result] = await pool.query(`SELECT id,username,email,fullName,avatar,createdAt FROM users WHERE id = ?`, [id])
    return result[0]
}

const findOneUser = async (email, username) => {
    //we can use if condition to check which one is passed
    const [result] = await pool.query(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username])
    // console.log(result)
    return result;
}




const updateUserRefreshToken = async (userId, refreshToken) => {
    if (refreshToken === null) {
        const [result] = await pool.query(`UPDATE users SET refreshToken = NULL WHERE id = ? `, [userId])
        return result
    }
    const [result] = await pool.query(`UPDATE users SET refreshToken = ? WHERE id = ? `, [refreshToken, userId])
    return result
}


const findByIdAndUpdateUserDetails = async(userId,updateData)=>{
    const {username,fullName,email} = updateData

    const [updateResult] = await pool.query(`UPDATE users set username = ?, fullName = ?, email = ? WHERE id = ?`,[username,fullName,email,userId])

    if(!updateResult){
        throw new ApiError(500,"unable to update user details")
    }

    const result = await pool.query(`SELECT id,username,email,fullName,avatar,createdAt,updatedAt FROM users WHERE id = ?`,[userId])

    return [result[0]]
}




export {
    createUser,
    findAll,
    findOneUser,
    updateUserRefreshToken,
    findById,
    findByIdNoPassAndRefToken,
    findByIdAndUpdateUserDetails
}