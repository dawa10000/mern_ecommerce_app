import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { promises as dns } from 'dns';

let transporter = null;

const initTransporter = async () => {
  const [smtpIp] = await dns.resolve4('smtp.gmail.com');
  console.log(`Resolved smtp.gmail.com → ${smtpIp}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`EMAIL_PASS set: ${!!process.env.EMAIL_PASS}`);

  transporter = nodemailer.createTransport({
    host: smtpIp,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      servername: 'smtp.gmail.com',
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
  });

  await transporter.verify();
  console.log("Mailer ready ✓");
};

initTransporter().catch((err) => {
  console.error("Mailer init failed:", err.message);
  transporter = null;
});

// Retry init if transporter is null when sending
const getTransporter = async () => {
  if (!transporter) {
    console.log("Retrying mailer init...");
    await initTransporter();
  }
  return transporter;
};

export const sendOrderConfirmedCustomer = async (order) => {
  const t = await getTransporter();
  await t.sendMail({ ... }); // keep your existing html
};

export const sendOrderReceivedAdmin = async (order) => {
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) return console.warn("No admin found");
  const t = await getTransporter();
  await t.sendMail({ ... }); // keep your existing html
};

export const sendOrderStatusUpdate = async (order) => {
  const config = statusConfig[order.status];
  if (!config) return;
  const t = await getTransporter();
  await t.sendMail({ ... }); // keep your existing html
};