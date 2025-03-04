import { v2 as blogCloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

blogCloudinary.config({
    cloud_name : process.env.BLOGCLOUD_NAME,
    api_key: process.env.BLOGAPI_KEY,
    api_secret: process.env.BLOGAPI_SECRET,
})

export default blogCloudinary