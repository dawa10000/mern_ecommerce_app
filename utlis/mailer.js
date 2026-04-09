import nodemailer from 'nodemailer';
import User from '../models/User.js';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  family: 4,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
});

export const sendOrderConfirmedCustomer = async (order) => {
  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `✅ Order Confirmed - #${order._id}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed 🎉</h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi <b>${order.firstName} ${order.lastName}</b>,</p>
          <p>Thank you for your order! We have received it and will begin processing it shortly.</p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><b>Order ID:</b> ${order._id}</p>
            <p style="margin: 4px 0;"><b>Payment Method:</b> ${order.paymentMethod}</p>
            <p style="margin: 4px 0;"><b>Subtotal:</b> Rs. ${order.subtotal}</p>
            <p style="margin: 4px 0;"><b>Total:</b> Rs. ${order.total}</p>
            <p style="margin: 4px 0;"><b>Shipping To:</b> ${order.street}, ${order.city}, ${order.province}, ${order.zip}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            We'll notify you when your order status changes. Thank you for shopping with us! 🎉
          </p>
        </div>
      </div>
    `,
  });
};


export const sendOrderReceivedAdmin = async (order) => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) return console.warn("No admin found to notify");

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: admin.email,
    subject: `🛒 New Order Received - #${order._id}`,
    html: `
      <h2>New Order Received</h2>
      <p><b>Order ID:</b> ${order._id}</p>
      <p><b>Customer:</b> ${order.firstName} ${order.lastName}</p>
      <p><b>Email:</b> ${order.email}</p>
      <p><b>Phone:</b> ${order.phone}</p>
      <p><b>Address:</b> ${order.street}, ${order.city}, ${order.province}, ${order.zip}</p>
      <p><b>Payment:</b> ${order.paymentMethod} — ${order.paymentStatus}</p>
      <p><b>Subtotal:</b> Rs. ${order.subtotal}</p>
      <p><b>Total:</b> Rs. ${order.total}</p>
    `,
  });
};


const statusConfig = {
  pending: {
    subject: 'Order Received',
    message: 'We have received your order and it is pending confirmation.',
    color: '#f59e0b',
  },
  processing: {
    subject: 'Order is Being Processed',
    message: 'Great news! Your order is currently being processed.',
    color: '#3b82f6',
  },
  shipped: {
    subject: 'Order Shipped',
    message: 'Your order is on its way! It has been shipped and will arrive soon.',
    color: '#8b5cf6',
  },
  delivered: {
    subject: 'Order Delivered',
    message: 'Your order has been delivered. We hope you enjoy your purchase!',
    color: '#10b981',
  },
  cancelled: {
    subject: 'Order Cancelled',
    message: 'Your order has been cancelled. Contact us if you have any questions.',
    color: '#ef4444',
  },
};


export const sendOrderStatusUpdate = async (order) => {
  const config = statusConfig[order.status];
  if (!config) return;

  await transporter.sendMail({
    from: `"Shop" <${process.env.EMAIL_USER}>`,
    to: order.email,
    subject: `${config.subject} - Order #${order._id}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${config.color}; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">
             ${config.subject}
          </h1>
        </div>
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hi <b>${order.firstName} ${order.lastName}</b>,</p>
          <p>${config.message}</p>
          <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0;"><b>Order ID:</b> ${order._id}</p>
            <p style="margin: 4px 0;"><b>Status:</b> 
              <span style="color: ${config.color}; font-weight: bold; text-transform: uppercase;">
                ${order.status}
              </span>
            </p>
            <p style="margin: 4px 0;"><b>Total:</b> Rs. ${order.total}</p>
            <p style="margin: 4px 0;"><b>Payment:</b> ${order.paymentMethod}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Thank you for shopping with us! 🎉
          </p>
        </div>
      </div>
    `,
  });
};

