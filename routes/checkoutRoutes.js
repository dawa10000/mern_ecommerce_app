import express from 'express';
import { notAllowed } from '../utlis/notAllowed.js';
import { checkUser, adminCheck } from '../middleware/checkUser.js';
import { cancelOrder } from "../controllers/checkoutController.js";
import { createCheckout, getOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/checkoutController.js';
import { checkoutSchema, validators } from '../utlis/validator.js';

const router = express.Router();

router.route('/')
  .post(checkUser, validators.body(checkoutSchema), createCheckout)
  .all(notAllowed);

router.route('/my-orders')
  .get(checkUser, getMyOrders)
  .all(notAllowed);

router.route('/all-orders')
  .get(checkUser, adminCheck, getAllOrders)
  .all(notAllowed);


router.route('/order/:id/status')
  .put(checkUser, adminCheck, updateOrderStatus)
  .all(notAllowed);


router.route('/:id')
  .get(checkUser, getOrder)
  .all(notAllowed);

router.patch("/:id/cancel", checkUser, cancelOrder);

export default router;