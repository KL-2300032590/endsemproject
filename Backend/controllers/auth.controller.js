import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { email, password, fullName, college, collegeId, state, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Special handling for KL University students
    const isKLStudent = college.toLowerCase() === "kluniversity";
    
    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      college,
      collegeId,
      state,
      address,
      role: isKLStudent ? 'admin' : 'user',
      isApproved: isKLStudent,
      paymentStatus: isKLStudent ? "approved" : "pending"
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      college: user.college,
      role: user.role,
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if non-KL University user is approved
    if (user.college.toLowerCase() !== "kluniversity" && !user.isApproved) {
      return res.status(403).json({ message: "Account pending approval" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      college: user.college,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

export const checkRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('role');
    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error checking role" });
  }
}; 