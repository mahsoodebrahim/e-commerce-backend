exports.register = (req, res, next) => {
  res.send("register");
};

exports.login = (req, res, next) => {
  res.send("login");
};

exports.logout = (req, res, next) => {
  res.send("logout");
};
