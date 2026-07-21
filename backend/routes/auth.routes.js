const express = require('express');
const router = express.Router();
const { createToken } = require('../utils/session');
const requireAuth = require('../middlewares/requireAuth');
const sendResponse = require('../utils/sendResponse');

const COOKIE_NAME = process.env.COOKIE_NAME || 'admin_session';
const { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_TTL_HOURS = '12' } = process.env;
const TTL_MS = Number(SESSION_TTL_HOURS) * 60 * 60 * 1000;

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return sendResponse(res, 400, false, 'Email and password are required');
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return sendResponse(res, 401, false, 'Invalid email or password');
  }

  const token = createToken(email);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // requires HTTPS in prod
    sameSite: 'lax',
    maxAge: TTL_MS,
    path: '/',
  });

  return sendResponse(res, 200, true, 'Logged in', { email });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  return sendResponse(res, 200, true, 'Logged out');
});

router.get('/me', requireAuth, (req, res) => {
  return sendResponse(res, 200, true, 'Authenticated', { email: req.admin.email });
});

module.exports = router;