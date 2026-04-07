import Product from "../models/Product.js";
import Review from "../models/Review.js";




export const getReview = async (req, res) => {

  const { id } = req.params;

  try {


    const reviews = await Review.find({ product: id }).populate({
      path: 'user',
      select: 'username image',

    });
    return res.status(200).json(reviews);


  } catch (err) {
    return res.status(400).json({
      message: err.message
    })

  }

}

export const createReview = async (req, res) => {
  const { comment, rating } = req.body || {};
  const { id } = req.params;
  try {

    await Review.create({
      user: req.userId,
      product: id,
      comment,
      rating
    });

    const reviews = await Review.find({ product: id });
    const product = await Product.findById(id);

    const avg = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    product.rating = Number(avg.toFixed(1));
    await product.save();


    return res.status(201).json({ message: "Review created successfully" });

  } catch (err) {
    return res.status(400).json({
      message: err.message
    })

  }

}

