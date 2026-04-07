import express from 'express';
import { notAllowed } from '../utlis/notAllowed.js';
import { createReview, getReview } from '../controllers/reviewController.js';
import { checkUser } from '../middleware/checkUser.js';





const router = express.Router();

router.route('/:id').post(checkUser, createReview).all(notAllowed);
router.route('/products/:id').get(getReview).all(notAllowed);



export default router;
