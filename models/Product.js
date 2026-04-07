import mongoose from "mongoose";



export const category = ["bed", "sofa", "chair", "wardrobe", "desk", "table"];

const productSchema = new mongoose.Schema({

  title: {
    type: String,
    minLength: [3, "Title must be at least 3 characters long"],
    maxLength: [100, "Title must be at most 100 characters long"],
    required: true
  },

  detail: {
    type: String,

    required: true
  },

  price: {
    type: Number,
    validate: {
      validator: (value) => {
        return value >= 0;
      },
      message: "Price must be non-negative"
    },
    required: true
  },

  stock: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },

  image: {
    type: [{
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    }],
    validate: {
      validator: (arr) => Array.isArray(arr) && arr.length > 0,
      message: "At least one image is required"
    }
  },

  category: {
    type: String,
    enum: {
      values: category,
      message: "{VALUE} is not supported"
    },
    required: true
  },




}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;