const { validateToken } = require("../services/auth");

function requireAuth(req, res, next) {
  const token = req.cookies.authToken;
  if (!token) return res.redirect("/user/signin");

  const user = validateToken(token);
  if (!user) return res.redirect("/user/signin");

  req.user = user;
  next();
}

module.exports = requireAuth;
