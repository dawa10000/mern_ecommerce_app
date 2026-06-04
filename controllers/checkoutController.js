import Checkout from "../models/Checkout.js";
import Product from "../models/Product.js";

import {
  sendOrderConfirmedCustomer,
  sendOrderReceivedAdmin,
  sendOrderStatusUpdate,
} from "../utlis/mailer.js";

export const createCheckout = async (req, res) => {
  const {
    firstName, lastName, companyName,
    country, street, city, province, zip,
    phone, email, additionalInfo,
    paymentMethod, products, subtotal, total,
  } = req.body;

  try {
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for: ${product.title}` });
      }
    }

    const order = await Checkout.create({
      user: req.userId,
      firstName, lastName, companyName,
      country, street, city, province, zip,
      phone, email, additionalInfo,
      paymentMethod, products, subtotal, total,
      status: "pending",
      paymentStatus: "pending",
    });

    let mailError = null;



    return res.status(201).json({
      message: "Order placed successfully",
      order,
      mailError,
    });
  } catch (err) {
    console.log("createCheckout error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Checkout.findById(id).populate("products.product");


    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }


    if (order.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }


    const nonCancellable = ["shipped", "delivered", "cancelled"];
    if (nonCancellable.includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled — current status is "${order.status}"`,
      });
    }


    if (order.paymentStatus === "paid") {
      for (const item of order.products) {
        const productId = item.product._id ?? item.product;
        await Product.findByIdAndUpdate(productId, {
          $inc: { stock: item.quantity },
        });
      }
    }


    order.status = "cancelled";
    await order.save();


    sendOrderStatusUpdate(order).catch((err) => {
      console.error("Mailer error (non-fatal):", err.message);
    });

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    console.error("cancelOrder error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Checkout.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    sendOrderStatusUpdate(order).catch((err) => {
      console.error("Mailer error (non-fatal):", err.message);
    });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Checkout.find()
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Checkout.find({ user: req.userId })
      .populate("products.product", "title price image")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Checkout.findById(req.params.id)
      .populate("products.product", "title price image")
      .populate("user", "username email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


