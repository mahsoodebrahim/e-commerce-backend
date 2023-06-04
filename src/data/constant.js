const UserRoleEnum = Object.freeze({
  USER: "user",
  ADMIN: "admin",
});

const SUPERUSERS = Object.freeze({
  ADMIN: UserRoleEnum.admin,
});

module.exports = {
  UserRoleEnum,
  SUPERUSERS,
};
