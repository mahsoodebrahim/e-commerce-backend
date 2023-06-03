const userRoles = Object.freeze({
  user: "user",
  admin: "admin",
});

const superusers = Object.freeze({
  admin: userRoles.admin,
});

module.exports = {
  userRoles,
  superusers,
};
