const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    req.user = user || null;
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

module.exports = optionalProtect;
