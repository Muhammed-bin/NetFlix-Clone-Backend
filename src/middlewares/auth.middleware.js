import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { findById, findByIdNoPassAndRefToken } from '../model/user.model.js'


const validateJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        // console.log(token)

        if(!token){
            throw new ApiError(400,"Unauthorized request")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            throw new ApiError(400,"unable to verify the token")
        }

        // console.log(decodedToken)

        const user = await findByIdNoPassAndRefToken(decodedToken.id)

        if(!user){
            throw new ApiError(404,"User not found")
        }

        // console.log(user)
        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401,"Unauthorized request")
    }
})

export {validateJWT}