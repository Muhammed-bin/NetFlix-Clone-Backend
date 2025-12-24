import {Router} from 'express'
import { getAllUsers, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { validateJWT } from '../middlewares/auth.middleware.js'


const router = Router()


router.route("/",).get(getAllUsers)
router.route("/register",).post(upload.single('avatar'),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(validateJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(validateJWT,getCurrentUser)



export default router