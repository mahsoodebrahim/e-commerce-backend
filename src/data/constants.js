const UserRoleEnum = Object.freeze({
  user: "user",
  admin: "admin",
});

const SUPERUSERS = Object.freeze({
  admin: UserRoleEnum.admin,
});

module.exports = {
  UserRoleEnum,
  SUPERUSERS,
};
