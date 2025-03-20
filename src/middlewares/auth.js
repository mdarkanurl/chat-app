import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try {
        const token = req?.cookies?.refreshToken || req.header?.authorization?.split(' ')[1];

        if(!token) {
            return res.status(400).json({ success: false, message: 'No token found, login first' });
        }

        const isValidToken = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

        if(!isValidToken) {
            return res.status(400).json({ success: false, message: 'Invalid token' });
        }

        req.userId = isValidToken.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}