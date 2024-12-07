const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('role');
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

export default adminMiddleware; 