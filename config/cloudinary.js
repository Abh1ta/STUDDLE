import {v2 as cloudinary} from "cloudinary"

const connectCloudinary=async (params) => {
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        secret_key: process.env.CLOUDINARY_SECRET_KEY
    })
    
}
export default connectCloudinary;