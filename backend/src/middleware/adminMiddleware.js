function adminMiddleware(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Admin access required',
      },
    });
  }

  next();
}

module.exports = adminMiddleware;
