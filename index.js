import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first");

import dotenv from 'dotenv';
dotenv.config({ quiet: true });


import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { setServers } from "node:dns/promises";

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';




const app = express();
setServers(["1.1.1.1", "8.8.8.8"]);


mongoose.connect(process.env.DB_URL).then((val) => {

  app.listen(5000, () => {
    console.log('DB connected and Server is running on port 5000');
  });

}).catch((err) => {
  console.log(err);
});

app.use(cors({
  credentials: true,
  origin: ['http://localhost:5173', 'https://mern-ecommerce-app-xi.vercel.app']
}));
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: false,
  limits: { fileSize: 5 * 1024 * 1024 },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.get('/', (req, res) => {

  return res.status(200).json({
    message: "Welcome to backened"
  });

});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/checkout', checkoutRoutes);



