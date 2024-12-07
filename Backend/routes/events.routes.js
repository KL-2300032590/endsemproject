// Add these routes if they don't exist
router.get('/user-registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
});

router.get('/admin/registrations', protect, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== 'all' ? { status } : {};
    const registrations = await Registration.find(query)
      .populate('userId', 'fullName email college collegeId paymentId paymentStatus paymentScreenshot')
      .populate('eventId', 'title');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations" });
  }
}); 