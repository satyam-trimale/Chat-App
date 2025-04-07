const cloudinary = require("cloudinary").v2
const fs = require("fs")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) {
            console.log("No file path provided");
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // console.log("File uploaded successfully:", response);

        // Remove the locally saved file
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        // Remove the locally saved file in case of error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}
const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if(!publicId) return null
        const response = await cloudinary.uploader.destroy(publicId, {resource_type: resourceType})
        return response
    } catch (error) {
        console.error("Cloudinary deletion error",error)
        return null
    }
}

module.exports = {uploadOnCloudinary, deleteFromCloudinary}