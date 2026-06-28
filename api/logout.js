const { serialize } = require('cookie');

module.exports = (req, res) => {
  const cookie = serialize('addict_auth', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  });
  res.setHeader('Set-Cookie', cookie);
  res.setHeader('Location', '/');
  return res.status(302).end();
};
