import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    // origin:process.env.CORS_ORIGIN,
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json({limit:"16kb",}))
app.use(express.urlencoded({limit:"16kb",extended:true}))
app.use(express.static("public"))
app.use(cookieParser())






//import routes
import userRoutes from './routes/user.routes.js'
import videoRoutes from './routes/video.routes.js'
import likeRoutes from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'
import playlistRouter from './routes/playlist.routes.js'




app.use("/api/v1/users",userRoutes)
app.use("/api/v1/videos",videoRoutes)
app.use("/api/v1/likes",likeRoutes)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/playlists",playlistRouter)




export {app}