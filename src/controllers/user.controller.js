import { createUser, findAll, findById, findByIdAndUpdateUserDetails, findOneUser, updatePassword, updateUserRefreshToken } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { defaultAvatar } from "../constants.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateAccessAndRefreshToken.js";
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshToken = (user)=>{
    try {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        updateUserRefreshToken(user.id,refreshToken)

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Error in generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body

    if ([username, fullName, password, email].some((field) => field.trim() === "")) {
        throw new ApiError(404, "All fields are required",)
    }

    // const existedUser = await findOne(email,username) //implement logic to check email or username is already used

    //hahsing password
    const hashedPassword = await bcryptjs.hash(password, 10)

    //file uploading feature
    const avatarLocalPath = req.file?.path
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const user = await createUser({
        username,
        email,
        fullName,
        password: hashedPassword,
        avatar: avatar ? avatar.url : defaultAvatar
    })

    if (!user) {
        throw new ApiError(500, "Unable to create a new user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, { username, fullName, email, password }, "user registration successfull")
        )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    if (!username && !email) {
        throw new ApiError(400,"Username or email is required")
    }

    const user = await findOneUser(email,username)

    if(!user){
        throw new ApiError(404,"User not found")
    }

    if(!password){
        throw new ApiError(400,"Password is required")
    }

    const isPasswordValid = await bcryptjs.compare(password,user[0].password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid credentials")
    }

    const {accessToken,refreshToken} = generateAccessAndRefreshToken(user[0])
    console.log(accessToken,refreshToken)


    const loggedInUser = await findById(user[0].id)

    console.log(loggedInUser)


    if(!loggedInUser){
        throw new ApiError(404,"User not found")
    }

    const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"
    }


    return res
            .status(201)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                new ApiResponse(201,loggedInUser,"User login successfull")
            )
})

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await findAll()
    return res
        .status(201)
        .json(
            new ApiResponse(201, users, "Fetched all users")
        )
})

const getCurrentUser = asyncHandler( async(req,res)=>{
    return res
            .status(201)
            .json(
                new ApiResponse(201,req.user,"Current user fetched Successfully")
            )
}) 

const logoutUser = asyncHandler(async(req,res)=>{
    await updateUserRefreshToken(req.user.id,null)
    const options = {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"

    }

    return res
        .status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refreshToken",options)
        .json(
            new ApiResponse(201,{},"Logged out successFully")
        )
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(400,"Refresh token is required")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user = await findById(decodedToken.id)
        
        if(!user){
            throw new ApiError(400,"Invalid refresh token")
        }
        
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(400,"Invalid refresh token")
        }

        const {accessToken,refreshToken:newRefreshToken} = generateAccessAndRefreshToken(user) // sending full user obeject to the function

        const options = {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production"
        }

        return res
                .status(201)
                .cookie("accessToken",accessToken,options)
                .cookie("refreshToken",newRefreshToken,options)
                .json(
                    new ApiResponse(201,{accessToken, newRefreshToken},"accessToken refreshed")
                )
                
    } catch (error) {
        throw new ApiError(400,"Invalid Refresh Token")
    }
}) 


const updateUserDetails = asyncHandler(async(req,res)=>{
    const {username,email,fullName} = req.body

    if([username,email,fullName].some((field)=>field.trim() === "" || !field)){
        throw new ApiError(400,"All fields are required")
    }

    if(username !== req.user?.username){
        const existedUser = await findOneUser(undefined,username)// passing undefined because we already used 2 parameter in the findOne user function we can change it in future
        if(existedUser){
            throw new ApiError(400,"username already taken")
        }


    }

    if(email !== req.user?.email){
        const existedUser = await findOneUser(email,undefined)
        if(existedUser){
            throw new ApiError(400,"email already taken")
        }
    }

    const updatedUser = await findByIdAndUpdateUserDetails(req.user.id,{username,fullName,email})
    console.log(updatedUser)

    if(!updatedUser){
        throw new ApiError(500,"unable to update user details")
    }
    


    return res
            .status(201)
            .json(
                new ApiResponse(201,updatedUser,"User details updated successfully")
            )


})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {password,newPassword} = req.body

    if(!password || !newPassword){
        throw new ApiError(400,"Old password and new password are required")
    }

    const user = await findById(req.user?.id)
    if(!user){
        throw new ApiError(400,"User Not Found")
    }

    const validatePassword = await bcryptjs.compare(password,user?.password)

    if(!validatePassword){
        throw new ApiError(400,"Incorrect password")
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword,10)

    await updatePassword(user.id,hashedNewPassword)

    return res
            .status(201)
            .json(
                new ApiResponse(201,{},"Password Updated Succesfully")
            )


})

const updateAvatar = asyncHandler(async(req,res)=>{

})



export {
    registerUser,
    loginUser,
    getAllUsers,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserDetails,
    changeCurrentPassword
}