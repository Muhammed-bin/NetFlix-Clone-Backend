import {Router} from 'express'
import { getAllUsers, loginUser, registerUser } from '../controllers/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'


const router = Router()


router.route("/",).get(getAllUsers)
router.route("/register",).post(upload.single('avatar'),registerUser)
router.route("/login").post(loginUser)

export default router