import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Enhanced uploadOnCloudinary to handle both file paths and buffers
const uploadOnCloudinary = async (fileInput) => {
  try {
    if (!fileInput) return null;

    // Check if fileInput is a buffer (for Vercel) or a file path (for local dev)
    if (Buffer.isBuffer(fileInput)) {
      // Handle buffer upload for Vercel deployment
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
              return null;
            } else {
              resolve(result);
            }
          }
        );

        // Write buffer to upload stream
        uploadStream.write(fileInput);
        uploadStream.end();
      });
    } else {
      // Handle file path upload for local development
      const response = await cloudinary.uploader.upload(fileInput, {
        resource_type: "auto",
      });

      // Clean up local file after upload
      try {
        fs.unlinkSync(fileInput);
      } catch (unlinkError) {
        console.warn("Warning: Could not unlink file:", unlinkError.message);
      }

      return response;
    }
  } catch (err) {
    console.error("Error in uploadOnCloudinary:", err);

    // If fileInput is a string (file path), try to clean up
    if (typeof fileInput === "string") {
      try {
        fs.unlinkSync(fileInput);
      } catch (unlinkError) {
        console.warn("Warning: Could not unlink file:", unlinkError.message);
      }
    }

    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

const getPublicIdFromUrl = (url) => {
  // Cloudinary URLs look like: https://res.cloudinary.com/<cloud_name>/video/upload/v1234567890/folder/filename.mp4
  // public_id is everything after '/upload/' and before the file extension
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  const pathWithVersionAndExt = parts[1];
  // Remove version if present (e.g., v1234567890/)
  const path = pathWithVersionAndExt.replace(/^v\d+\//, "");
  // Remove file extension
  return path.replace(/\.[^/.]+$/, "");
};

export { getPublicIdFromUrl, uploadOnCloudinary, deleteFromCloudinary };
