const { verifyToken } = require('../utils/session');
const sendResponse = require('../utils/sendResponse');

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_session';

function requireAuth(req, res, next) {
  const session = verifyToken(req.cookies[COOKIE_NAME]);
  if (!session) {
    return sendResponse(res, 401, false, 'Not authenticated');
  }
  req.admin = session;
  next();
}

module.exports = requireAuth;