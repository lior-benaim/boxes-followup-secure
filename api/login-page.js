const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function makeToken(pass) {
  return crypto.createHmac('sha256', pass + '_addict_2026')
    .update('addict_authenticated')
    .digest('hex');
}

function parseCookies(cookieHeader) {
  const cookies = {};
  (cookieHeader || '').split(';').forEach(part => {
    const [k, ...v] = part.trim().split('=');
    if (k) cookies[k.trim()] = v.join('=').trim();
  });
  return cookies;
}

module.exports = (req, res) => {
  // If already logged in → go straight to app, no flash
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies['addict_auth'];
  const validPass = (process.env.password || '').trim();
  const validToken = makeToken(validPass);

  if (token && token === validToken) {
    res.setHeader('Location', '/app');
    return res.status(302).end();
  }

  // Not logged in → serve login page
  const html = fs.readFileSync(path.join(process.cwd(), 'login.html'), 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  return res.status(200).send(html);
};
