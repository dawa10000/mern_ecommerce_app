
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const supportedFormats = ['.jpg', '.png', '.jpeg', '.gif', '.webp'];

const uploadToCloudinary = (fileBuffer) => {

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products', public_id: uuidv4(), resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    stream.end(fileBuffer);
  });
};
export const fileCheck = async (req, res, next) => {
  const file = req.files?.image;
  if (!file) return res.status(400).json({ message: "Please upload an image" });

  const filesArray = Array.isArray(file) ? file : [file];

  for (const item of filesArray) {
    const ext = path.extname(item.name).toLowerCase();
    if (!supportedFormats.includes(ext)) {
      return res.status(400).json({ message: `Unsupported file format: ${item.name}` });
    }
  }
  const MAX_SIZE_MB = 5;
  for (const item of filesArray) {
    if (item.size > MAX_SIZE_MB * 1024 * 1024) {
      return res.status(400).json({ message: `File too large: ${item.name}` });
    }
  }

  try {
    const uploadedUrls = await Promise.all(
      filesArray.map((item) => uploadToCloudinary(item.data))
    );
    req.imagePath = uploadedUrls;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Image upload failed: " + err.message });
  }
};

export const updateFileCheck = async (req, res, next) => {
  const file = req.files?.image;
  if (!file) return next();

  const filesArray = Array.isArray(file) ? file : [file];

  for (const item of filesArray) {
    const ext = path.extname(item.name).toLowerCase();
    if (!supportedFormats.includes(ext)) {
      return res.status(400).json({ message: `Unsupported file format: ${item.name}` });
    }
  }

  try {
    const uploadedUrls = await Promise.all(
      filesArray.map((item) => uploadToCloudinary(item.data))
    );
    req.imagePath = uploadedUrls;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Image upload failed: " + err.message });
  }
};