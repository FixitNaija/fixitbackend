const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.user) {
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};