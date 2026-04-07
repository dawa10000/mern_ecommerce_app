import express from "express";
import mongoose from "mongoose";

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  top5Product,
  updateProduct,
} from "../controllers/productController.js";

import { fileCheck, updateFileCheck } from "../middleware/fileCheck.js";
import { adminCheck, checkUser } from "../middleware/checkUser.js";
import { notAllowed } from "../utlis/notAllowed.js";

const router = express.Router();

// ✅ validate id
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }
  req.productId = id;
  next();
});

// ✅ routes
router
  .route("/")
  .get(getProducts)
  .post(checkUser, adminCheck, fileCheck, createProduct)
  .all(notAllowed);

router.route("/top-5").get(top5Product).all(notAllowed);

router
  .route("/:id")
  .get(getProduct)
  .patch(checkUser, adminCheck, updateFileCheck, updateProduct)
  .delete(checkUser, adminCheck, deleteProduct)
  .all(notAllowed);

export default router;