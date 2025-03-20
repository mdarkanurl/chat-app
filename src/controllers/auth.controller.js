import User from "../models/user.model.js";
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { generateJwtRefreshToken } from "../lib/generateJwtToken.js";
import { uploadImageToCloudinary } from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check all data using Joi
        const schema = Joi.object({
            fullname: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).regex(/[a-z]/, 'lowercase').regex(/\d/, 'Number').required(),
        });

        const { error } = schema.validate(req.body, { abortEarly: false, errors: { wrap: { label: "" } } });

        if( error ) {
            const err = error.details.map(msg => msg.message);
            return res.status(301).json({ success: false, message: err });
        }        

        const isUserAlreadyExists = await User.findOne({ email });

        if(isUserAlreadyExists) {
            return res.status(400).json({ success: false, message: 'User alresdy exists, please login' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ fullname, email, password: hashedPassword });

        await generateJwtRefreshToken(user._id, res);

        return res.status(201).json({ success: true, message: `${fullname} your account create` });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ success: false, message: 'All data must give' });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const decodePassword = await bcrypt.compare(password, user.password);

        if(!decodePassword) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }

        const token = req?.cookies?.refreshToken || req.header?.authorization?.split(' ')[1];

        if(!token) {
            await generateJwtRefreshToken(user._id, res);
        }

        res.status(200).json({ success: true, message: 'You\'re loggin' });
    } catch (error) {
        console.log(error);
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({ success: true, message: 'You\'ve logout successfully' });
    } catch (error) {
        console.log(error);
    }
}

export const profilePic = async (req, res) => {
    try {
      const image = req.file;
      const userId = req.userId;

      if (!image) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      const uploadResult = await uploadImageToCloudinary(image);

      const user = await User.findByIdAndUpdate(userId, { profilePic: uploadResult.url })
  
      return res.status(200).json({
        message: 'Image uploaded successfully',
        data: uploadResult.url,
      });
    } catch (error) {
      console.error('Error in profilePic:', error);
      return res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findOne({_id: userId}).select('-password');

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}