import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user?.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin only." });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
