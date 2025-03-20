import express from 'express';
import { checkAuth, login, logout, profilePic, signup } from '../controllers/auth.controller.js';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/multer.js';
const router = express.Router();

router.route('/signup')
    .post(signup)


router.route('/login')
    .post(login)


router.route('/logout')
    .get(logout)

    
router.route('/profile-pic')
    .put(auth, upload.single('image'), profilePic)


router.route('/check-auth')
    .get(auth, checkAuth)

export default router