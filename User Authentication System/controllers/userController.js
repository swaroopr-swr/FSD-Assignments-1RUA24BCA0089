// GET /api/users/profile
exports.getProfile = (req, res) => {
  res.json({ success: true, user: req.user });
};

// GET /api/admin/dashboard
exports.adminDashboard = (req, res) => {
  res.json({ success: true, message: `Welcome to the admin dashboard, ${req.user.name}`, user: req.user });
};
