import validation from 'express-joi-validation';
import Joi from 'joi';



export const validators = validation.createValidator({
  passError: true
});

export const productSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  detail: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  category: Joi.string().valid("bed", "sofa", "chair", "wardrobe", "desk", "table").required(),
  image: Joi.any().optional()
}).options({ allowUnknown: true });

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  bio: Joi.string().required()
});




export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});


export const checkoutSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  companyName: Joi.string().allow('').optional(),
  country: Joi.string().required(),
  street: Joi.string().required(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  zip: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  additionalInfo: Joi.string().allow('').optional(),
  paymentMethod: Joi.string().valid("eSewa", "Cash On Delivery").required(),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().min(1).required()
    })
  ).min(1).required(),
  subtotal: Joi.number().required(),
  total: Joi.number().required(),
});