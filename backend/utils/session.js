const crypto = require('crypto');

const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_TTL_HOURS = process.env.SESSION_TTL_HOURS || '12';
const TTL_MS = Number(SESSION_TTL_HOURS) * 60 * 60 * 1000;

if (!SESSION_SECRET) {
  console.error('Missing SESSION_SECRET in .env — set a long random string.');
  process.exit(1);
}

function sign(payload) {
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

function createToken(email) {
  const expiresAt = Date.now() + TTL_MS;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString('base64url');
  return sign(payload);
}

function verifyToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, receivedHmac] = token.split('.');
  const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');

  const a = Buffer.from(receivedHmac, 'hex');
  const b = Buffer.from(expectedHmac, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > data.expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

module.exports = { createToken, verifyToken, TTL_MS };