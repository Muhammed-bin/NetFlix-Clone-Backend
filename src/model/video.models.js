import pool from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";


const uploadVideoToDB = async(videoData)=>{
    const {title,description,thumbnail,videoFile,views,owner,isPublished,duration} = videoData

    const [insertResult] = await pool.query(`INSERT INTO videos (title,description,thumbnail,videoFile,views,owner,isPublished,duration) VALUES (?,?,?,?,?,?,?,?)`,[title,description,thumbnail,videoFile,views,owner,isPublished,duration])

    if(!insertResult.insertId){
        return
    }

    const [result] = await pool.query(`SELECT * FROM videos WHERE id =?`,[insertResult.insertId])
    return result[0]
}


const getVideoById = async(videoId)=>{
    const [result] = await pool.query(`SELECT * FROM videos WHERE id =?`,[videoId])
    return result[0]
}

const getVideosFromDB = async({page,limit,query})=>{
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = limit * (page - 1)

    let whereClause = ""
    let values = []

    if(query){
        whereClause = `WHERE title LIKE ? OR description LIKE ?`
        values.push(`%${query}%`,`%${query}`)
    }

    const [results] = await pool.query(
        `SELECT * FROM videos 
        ${whereClause}
        ORDER BY createdAt DESC 
        LIMIT ? OFFSET ?`
        ,[...values,parseInt(limit),parseInt(offset)])
    return results
}
 
export {uploadVideoToDB,getVideosFromDB}













// const createVideoTableQuary = async()=>{
//     const Executablequery = `CREATE TABLE videos (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     thumbnail VARCHAR(500),
//     videoFile VARCHAR(500) NOT NULL,

//     views BIGINT DEFAULT 0,

//     owner INT NOT NULL,
//     isPublished BOOLEAN DEFAULT FALSE,

//     duration INT, -- in seconds

//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

//     -- Indexes
//     INDEX idx_owner (owner),
//     INDEX idx_isPublished (isPublished),
//     INDEX idx_owner_published (owner, isPublished),
//     INDEX idx_createdAt (createdAt),

//     -- Foreign key
//     CONSTRAINT fk_videos_owner
//         FOREIGN KEY (owner)
//         REFERENCES users(id)
//         ON DELETE CASCADE
// ) ENGINE=InnoDB;`

//     const result = await pool.query(Executablequery)
//     return result
// }

// console.log(createVideoTableQuary())