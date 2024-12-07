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
    walletAddress: {
      type: Sequelize.STRING,
    }
  },
  {
    freezeTableName: true,
    timestamps: true,
    logging: false,
  }
);

// sequelize.sync({ alter: true });
module.exports = RegistrationData;
