import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getMessages, getUser, sendMessage } from '../controllers/message.controller.js';
import { upload } from '../middlewares/multer.js';
const router = express.Router();

router.route('/user')
    .get(auth, getUser)


router.route('/:id')
    .get(auth, getMessages)


router.route('/send/:id')
    .post(auth, upload.single('me'), sendMessage)

export default router