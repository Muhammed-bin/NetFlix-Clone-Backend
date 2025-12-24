import {Router} from 'express'
import { getAllUsers, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { validateJWT } from '../middlewares/auth.middleware.js'


const router = Router()


router.route("/",).get(getAllUsers)
router.route("/register",).post(upload.single('avatar'),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(validateJWT,logoutUser)

export default router