import { getVideosFromDB, uploadVideoToDB } from "../model/video.models.js";
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
        duration:0

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

})



const updateVideo = asyncHandler(async(req,res)=>{

})

const deleteVideo = asyncHandler(async(req,res)=>{

})

const togglePublishStatus = asyncHandler(async(req,res)=>{

})


export {
    updateVideo,
    uploadVideo,
    getAllVideos
}