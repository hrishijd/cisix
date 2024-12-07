var Sequelize = require('sequelize');
var sequelize = require('../../Express Database/connection');

var RegistrationData = sequelize.define('RegistrationData', {
  userId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  fullName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  walletAddress: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
}, {
  createdAt: false,
  updatedAt: false,
  freezeTableName: true,
  timestamps: false,
  logging: false,
});

// sequelize.sync({ alter: true });
module.exports = RegistrationData;
