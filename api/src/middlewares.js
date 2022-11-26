const jwt = require('jsonwebtoken');
const { returnUnauthorized } = require('./utils');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, 'secret');
      if (decoded) return next();
      return returnUnauthorized(res);
    }
    return returnUnauthorized(res);
  } catch(e) {
    return returnUnauthorized(res);
  }
};

module.exports = { verifyToken };
