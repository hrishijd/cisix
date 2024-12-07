var Sequelize = require("sequelize");
var sequelize = require("../connection");

var RegistrationData = sequelize.define(
  "RegistrationData",
  {
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
      allowNull: false,
      unique: true,
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
  },
  {
    freezeTableName: true,
    timestamps: true,
    logging: false,
  }
);

// sequelize.sync({ alter: true });
module.exports = RegistrationData;
