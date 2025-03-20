import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SERECT
});

export const uploadImageToCloudinary = async (image) => {
    try {
        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'profile pic' },
                (err, result) => {
                    if(err) {
                        reject (err)
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        })

        return uploadResult
    } catch (error) {
        console.log(error)
    }
}