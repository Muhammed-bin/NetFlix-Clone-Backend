import { createUser, findAll, findById, findOneUser, updateUserRefreshToken } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcryptjs from "bcryptjs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { defaultAvatar } from "../constants.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateAccessAndRefreshToken.js";


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

export {
    registerUser,
    loginUser,
    getAllUsers,
    logoutUser
}