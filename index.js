import { setDefaultResultOrder } from "dns";
setDefaultResultOrder("ipv4first");

import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";

const app = express();


app.use(cors({
  credentials: true,
  origin: ["https://mern-ecommerce-app-xi.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));




app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(fileUpload({
  useTempFiles: false,
  limits: { fileSize: 5 * 1024 * 1024 },
}));


app.get("/", (req, res) => res.status(200).json({ message: "Welcome to backend" }));
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/checkout", checkoutRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});


mongoose.connect(process.env.DB_URL)
  .then(() => {
    app.listen(5000, () => console.log("DB connected and server running on port 5000"));
  })
  .catch((err) => console.log(err));