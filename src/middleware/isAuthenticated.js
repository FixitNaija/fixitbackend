const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    let token;

    // Check cookie first
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    // Otherwise check Authorization header
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user || decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
