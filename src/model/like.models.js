import pool from "../db/index.js"
import { ApiError } from "../utils/ApiError.js"

const getByIdAndAddLike = async (data) => {
    const [result] = await pool.query(`INSERT INTO likes(userId,videoId) VALUES(?,?)`, [data.userId, data.videoId])
    return result;
}

const getByIdAndRemoveLike = async (data) => {
    const [result] = await pool.query(`DELETE FROM likes WHERE videoId=? AND userId=?`, [data.videoId, data.userId])
    return result
}

const checkIsLikedVideo = async (data) => {
    const [result] = await pool.query(`SELECT * FROM likes WHERE videoId=? AND userId=?`, [data.videoId, data.userId])
    return result.length > 0;
}


const getVideoLikeCount = async (id) => {
    const [result] = await pool.query(`
        SELECT COUNT(*) AS like_count
        FROM likes
        WHERE videoId = ?;`, [id])

    return result[0]

}

export {
    getByIdAndAddLike,
    getByIdAndRemoveLike,
    checkIsLikedVideo,
    getVideoLikeCount
}



// CREATE TABLE likes (\
//     id INT AUTO_INCREMENT,
//     userId INT NOT NULL,
//     videoId INT NOT NULL,
//     likedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

//     PRIMARY KEY (userId, videoId),

//     CONSTRAINT fk_likes_user
//         FOREIGN KEY (userId)
//         REFERENCES users(id)
//         ON DELETE CASCADE,

//     CONSTRAINT fk_likes_video
//         FOREIGN KEY (videoId)
//         REFERENCES videos(id)
//         ON DELETE CASCADE
// ) ENGINE=InnoDB;