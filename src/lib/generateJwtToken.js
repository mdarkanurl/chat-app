import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../models/user.model.js';
config();

export const generateJwtRefreshToken = async (userId, res) => {
    try {
        const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '30d' });

        await User.findByIdAndUpdate( userId, { refresh_token: refreshToken })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    } catch (error) {
        console.log(error)
    }
}