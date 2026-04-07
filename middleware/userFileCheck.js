import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { supportedFormats } from './fileCheck.js';






const uploadToCloudinary = (fileBuffer) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'users',
        public_id: uuidv4(),
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          console.log("Cloudinary error:", error);
          reject(error);
        }
        else resolve(result.secure_url);
      }
    );
    console.log("fileBuffer:", fileBuffer?.length);
    stream.end(fileBuffer);
  });
};

export const userFileCheck = async (req, res, next) => {
  const file = req.files?.image;

  console.log("req.files:", req.files);
  console.log("file:", file);
  console.log("file.data:", file?.data);

  if (!file) return res.status(400).json({ message: "Please upload an image" });


  const fileItem = Array.isArray(file) ? file[0] : file;

  const ext = path.extname(fileItem.name).toLowerCase();
  if (!supportedFormats.includes(ext)) {
    return res.status(400).json({ message: "Unsupported file format" });
  }

  try {
    const url = await uploadToCloudinary(fileItem.data);
    req.imagePath = url;
    next();
  } catch (err) {
    console.log("Upload error:", err);
    return res.status(500).json({ message: "Image upload failed: " + err.message });
  }
};

export const userFileUpdateCheck = async (req, res, next) => {
  const file = req.files?.image;
  if (!file) return next();

  const fileItem = Array.isArray(file) ? file[0] : file;

  const ext = path.extname(fileItem.name).toLowerCase();
  if (!supportedFormats.includes(ext)) {
    return res.status(400).json({ message: "Unsupported file format" });
  }

  try {
    const url = await uploadToCloudinary(fileItem.data);
    req.imagePath = url;
    next();
  } catch (err) {
    console.log("Upload error:", err);
    return res.status(500).json({ message: "Image upload failed: " + err.message });
  }
};