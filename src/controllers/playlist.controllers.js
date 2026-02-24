import { addVideoToPlaylistInDb, createNewPlaylistInDb, deletePlaylistFromDb, findByIdAndGetAllPlaylistVideos, getByIdAndRemoveVideo } from "../model/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlayList = asyncHandler(async (req, res) => {
    const { name } = req.body

    const playlist = await createNewPlaylistInDb({
        name,
        owner_id: req.user.id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, {}, "Playlist created")
        )
})


const addVideoToPlayList = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params

    const addVideo = await addVideoToPlaylistInDb({
        videoId,
        playlistId
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, addVideo, "Video Added to the playlist")
        )
})

const getPlaylistVideos = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    const playlistVideos = await findByIdAndGetAllPlaylistVideos(playlistId)

    return res
            .status(201)
            .json(
                new ApiResponse(201,playlistVideos,"Playlist videos fetched")
            )
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params

    const removeVideo = await getByIdAndRemoveVideo({
        playlistId,
        videoId,
        userId:req.user.id
    })

    return res
            .status(201)
            .json(
                new ApiResponse(201,{},"Video removed from the playlist")
            )


})

const deletePlaylist = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    const deleted = await deletePlaylistFromDb({
        playlistId,
        userId:req.user.id
    })

    return res
            .status(201)
            .json(
                new ApiResponse(201,{},"Playlist deleted")
            )

})

// const changeVideoPosition = asyncHandler(async(req,res)=>{
//     const {playlistId,videoId} = req.params
//     const {newPosition} = req.body


// })


export {
    createPlayList,
    addVideoToPlayList,
    getPlaylistVideos,
    removeVideoFromPlaylist,
    deletePlaylist
}