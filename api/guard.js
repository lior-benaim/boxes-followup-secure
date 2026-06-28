const { parse } = require('cookie');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SECRET = process.env.password + '_addict_secret_2026';

function makeToken() {
  return crypto.createHmac('sha256', SECRET)
    .update('addict_authenticated')
    .digest('hex');
}

module.exports = async (req, res) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies['addict_auth'];
  const validToken = makeToken();

  if (!token || token !== validToken) {
    res.setHeader('Location', '/');
    return res.status(302).end();
  }

  // Serve app.html
  const appPath = path.join(process.cwd(), 'app.html');
  const html = fs.readFileSync(appPath, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
};
