var Sequelize = require("sequelize");
var sequelize = require("../connection");
const { FORCE } = require("sequelize/lib/index-hints");

var blobs = sequelize.define(
  "blobs",
  {
    blobId: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.DataTypes.STRING,
    },
    walletAddress: {
      type: Sequelize.DataTypes.STRING,
    },
    executionId: {
      type: Sequelize.DataTypes.INTEGER,
    },
    blockNo: {
      type: Sequelize.DataTypes.INTEGER,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    freezeTableName: true,
    timestamps: true,
    logging: false,
    FORCE: true,
  }
);

// sequelize.sync({ alter: true });
module.exports = blobs;
