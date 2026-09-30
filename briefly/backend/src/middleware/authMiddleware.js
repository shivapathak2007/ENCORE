const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Bypassing login entirely for public access
  req.user = { id: '12345678-1234-1234-1234-123456789012' };
  next();
};

module.exports = { protect };
