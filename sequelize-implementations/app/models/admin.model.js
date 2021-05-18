module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define("admins", {
    roleId: {
      type: Sequelize.INTEGER,
    },
    shopId: {
      type: Sequelize.INTEGER,
    },
    userName: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    fullName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    telephone: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    sessionId: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    systemAdmin: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Admin;
};
