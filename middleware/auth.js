function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please log in to view this resource" });
}

module.exports = ensureAuthenticated;
