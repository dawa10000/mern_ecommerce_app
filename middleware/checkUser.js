import jwt from 'jsonwebtoken';

export const checkUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const adminCheck = (req, res, next) => {
  if (req.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  return next();
};