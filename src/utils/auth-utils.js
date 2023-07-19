const { SUPERUSERS } = require("../data/constants");

exports.isSuperuser = (userRole) => {
  if (!SUPERUSERS.hasOwnProperty(userRole)) {
    return false;
  }

  return true;
};
