import Product from "../models/Product.js";
import { v2 as cloudinary } from 'cloudinary';


const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

const deleteFromCloudinary = async (image) => {
  try {
    if (!image?.publicId) return;
    const cl = getCloudinary();
    await cl.uploader.destroy(image.publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

export const top5Product = async (req, res) => {
  try {
    const product = await Product.find({ rating: { $gt: 4 } })
      .sort({ rating: -1 })
      .limit(5);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ["sort", "page", "limit", "search", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);


    const searchFilter = req.query.search ? {
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { category: { $regex: req.query.search, $options: "i" } },
      ]
    } : {};

    const combinedFilter = { ...queryObj, ...searchFilter };


    let query = Product.find(combinedFilter);

    if (req.query.fields) {
      query = query.select(req.query.fields.split(",").join(" "));
    }

    if (req.query.sort) {
      query = query.sort(req.query.sort.split(",").join(" "));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;
    const total = await Product.countDocuments(combinedFilter);

    return res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { title, detail, price, stock, category } = req.body;

    await Product.create({
      title, detail, price, stock, category,
      image: req.imagePath.flat(),
    });

    return res.status(201).json({ message: "Product created successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { title, detail, price, stock, category } = req.body || {};
  try {
    const isExist = await Product.findById(req.productId);
    if (!isExist) return res.status(404).json({ message: "Product not found" });


    const oldImages = req.body.oldImages ? JSON.parse(req.body.oldImages) : [];


    const removedImages = isExist.image.filter(
      (img) => !oldImages.some((old) => old.publicId === img.publicId)
    );
    await Promise.all(removedImages.map(deleteFromCloudinary));


    const newImages = req.imagePath || [];
    isExist.image = [...oldImages, ...newImages];

    isExist.title = title || isExist.title;
    isExist.detail = detail || isExist.detail;
    isExist.price = price ?? isExist.price;
    isExist.stock = stock ?? isExist.stock;
    isExist.category = category || isExist.category;

    await isExist.save();
    return res.status(200).json({ message: "Product updated" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const isExist = await Product.findById(req.productId);
    if (!isExist) return res.status(404).json({ message: "Product not found" });


    await Promise.all(isExist.image.map(deleteFromCloudinary));

    await isExist.deleteOne();
    return res.status(200).json({ message: "Product deleted" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};