import { getVideoById, getVideosFromDB,  increamentVideoViewInDB, uploadVideoToDB } from "../model/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req,res)=>{
    const {title,description} = req.body

    if(!title || !description){
        throw new ApiError(400,"title and description are required")
    }


    const videoFileLocalPath = req.files?.videoFile?.[0].path

    if(!videoFileLocalPath){
        throw new ApiError(400,"Video File is required")
    }

    const thumbnailLocalPath = req.files?.thumbnail?.[0].path

    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is required")
    }

    const video = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video.url){
        throw new ApiError(500,"Unable to upload video")
    }

    if(!thumbnail.url){
        throw new ApiError(500,"Unable to upload thumbnail")
    }

    const videoUploaded = await uploadVideoToDB({
        title,
        description,
        thumbnail:thumbnail?.url,
        videoFile:video?.url,
        views:0,
        owner:req.user.id,
        isPublished:true,
        duration:video?.duration || 0

    })

    if(!videoUploaded){
        throw new ApiError(500,"Unable upload video")
        //if not uploaded successfully we should delete file from cloudinary
    }

    return res
            .status(201)
            .json(
                new ApiResponse(201,videoUploaded,"video uploaded successfully")
            )

})

const getAllVideos = asyncHandler(async(req,res)=>{
    const {page=1,limit=10,query} = req.query;
    console.log(page,limit,query)

    const videos = await getVideosFromDB({page,limit,query})

    if(!videos){
        throw new ApiError(500,"unable to fetch videos")
    }

    return res
            .status(201)
            .json(
                new ApiResponse(201,videos,"videos fetched successfully")
            )
})

const getVideo = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    const video = await getVideoById(id)

    if(!video){
        throw new ApiError(404,"video not found")
    }


    return res
            .status(201)
            .json(
                new ApiResponse(201,video,"video fetched successfully")
            )




})


const increamentViewCount = asyncHandler(async(req,res)=>{ 

    const {id} = req.params
    const upadted = await increamentVideoViewInDB(id);

    if(!upadted){
        throw new ApiError(500,"Unable to increament views")
    }

    return res
            .status(201)
            .json(
                new ApiResponse(201,{},"View increamented")
            )

})



const updateVideo = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const {title,description} = req.body;

    if(!title?.trim() && !description?.trim()){
        throw new ApiError(400,"Please make any changes to update ")
    }

    const updateData = {}

    if(title.trim()) updateData.title = title
    if(description.trim()) updateData.description = description

    const upadted = await updateVideoInDB({
        id,
        title,
        description
    })

    console.log(upadted)

 })

const deleteVideo = asyncHandler(async(req,res)=>{

})

const togglePublishStatus = asyncHandler(async(req,res)=>{

})


export {
    updateVideo,
    uploadVideo,
    getAllVideos,
    getVideo,
    increamentViewCount
}