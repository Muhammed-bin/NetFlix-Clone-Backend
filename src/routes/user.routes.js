import {Router} from 'express'
import { changeCurrentPassword, getAllUsers, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserDetails } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { validateJWT } from '../middlewares/auth.middleware.js'


const router = Router()


router.route("/",).get(getAllUsers)
router.route("/register",).post(upload.single('avatar'),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(validateJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(validateJWT,getCurrentUser)
router.route("/update-details").patch(validateJWT,updateUserDetails)
router.route("/change-password").patch(validateJWT,changeCurrentPassword)


export default router