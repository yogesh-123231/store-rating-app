function ownerMiddleware(req, res, next) {
  if (req.user.role !== 'OWNER') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Store owner access required',
      },
    });
  }

  next();
}

module.exports = ownerMiddleware;
