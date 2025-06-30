const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove Bearer prefix if present
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload to req.user (adjust as needed for your payload structure)
    req.user = decoded.user || decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};