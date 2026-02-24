import pool from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";


const uploadVideoToDB = async (videoData) => {
    const { title, description, thumbnail, videoFile, views, owner, isPublished, duration } = videoData

    const [insertResult] = await pool.query(`INSERT INTO videos (title,description,thumbnail,videoFile,views,owner,isPublished,duration) VALUES (?,?,?,?,?,?,?,?)`, [title, description, thumbnail, videoFile, views, owner, isPublished, duration])

    if (!insertResult.insertId) {
        return
    }

    const [result] = await pool.query(`SELECT * FROM videos WHERE id =?`, [insertResult.insertId])
    return result[0]
}


const getVideoById = async (videoId) => {
    const [result] = await pool.query(`SELECT 
        videos.id,title,description,videoFile,thumbnail,views,owner,duration,fullName,avatar,videos.createdAt 
        FROM videos 
        INNER JOIN users on videos.owner = users.id WHERE 
        videos.id =?`, [videoId])
    return result[0]
}

const getVideosFromDB = async ({ page, limit, query }) => {
    page = parseInt(page) || 1
    limit = parseInt(limit) || 10
    const offset = limit * (page - 1)

    let whereClause = ""
    let values = []

    if (query) {
        whereClause = `WHERE title LIKE ? OR description LIKE ?`
        values.push(`%${query}%`, `%${query}`)
    }

    const [results] = await pool.query(
        `SELECT videos.id,title,description,videoFile,thumbnail,views,owner,duration,isPublished,fullName,avatar,videos.createdAt FROM videos 
         INNER JOIN users on videos.owner = users.id
        ${whereClause}
        ORDER BY videos.createdAt DESC 
        LIMIT ? OFFSET ? 
        `
        , [...values, parseInt(limit), parseInt(offset)])

    console.log(results)
    return results
}


const increamentVideoViewInDB = async(videoId)=>{
    const [results] = await pool.query(`UPDATE videos SET views = views+1 WHERE id=?`,[videoId])
    return results
}

const updateVideoInDB = async(videoData)=>{
     try {
        // Build dynamic query based on provided fields
        const updates = [];
        const values = [];

        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }

        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }

        // If no fields to update
        if (updates.length === 0) {
            return null;
        }

        // updatedAt is handled automatically by ON UPDATE CURRENT_TIMESTAMP
        // Add id as the last parameter for WHERE clause
        values.push(id);

        const query = `
            UPDATE videos 
            SET ${updates.join(', ')} 
            WHERE id = ?
        `;

        const [result] = await pool.execute(query, values);

        // Check if any row was affected
        if (result.affectedRows === 0) {
            return null;
        }

        // Fetch and return the updated video
        const [rows] = await pool.execute(
            'SELECT * FROM videos WHERE id = ?',
            [id]
        );

        return rows[0];

    } catch (error) {
        console.error('Error updating video:', error);
        throw error;
    }

}

export { uploadVideoToDB, getVideosFromDB, getVideoById,increamentVideoViewInDB }













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