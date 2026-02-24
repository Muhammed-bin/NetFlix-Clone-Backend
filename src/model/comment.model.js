import pool from "../db/index.js";


const getByIdAndAddComment = async(data)=>{
    const {content, owner, video} = data;

    const [result] = await pool.query(`INSERT INTO comments(content,owner,video) VALUES(?,?,?)`,[content,owner,video]);

    return result;
    
}

const getAllCommentsByVideoId = async(videoId)=>{
    const [result] = await pool.query( `SELECT 
        comments.id,comments.content,comments.createdAt,users.id AS user_id,users.username,users.avatar
        FROM comments INNER JOIN users
        on comments.owner = users.id
        WHERE video = ?`,[videoId])
    console.log(result)
    return result

}



export {getByIdAndAddComment,getAllCommentsByVideoId}




// await pool.query(`CREATE TABLE comments (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     content TEXT NOT NULL,

//     owner INT NOT NULL,
//     video INT NOT NULL,

//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

//     CONSTRAINT fk_comments_owner
//         FOREIGN KEY (owner)
//         REFERENCES users(id)
//         ON DELETE CASCADE,

//     CONSTRAINT fk_comments_video
//         FOREIGN KEY (video)
//         REFERENCES videos(id)
//         ON DELETE CASCADE,

//     INDEX idx_comments_owner (owner),
//     INDEX idx_comments_video (video)
// ) ENGINE=InnoDB;
// `)