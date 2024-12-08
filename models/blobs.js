var Sequelize = require("sequelize");
var sequelize = require("../../Express Database/connection");

var blobs = sequelize.define(
  "blobs",
  {
    blobId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    walletAddress: {
      type: Sequelize.STRING,
    },
    executionId: {
      type: Sequelize.INTEGER,
    },
    BlockNo: {
      type: Sequelize.STRING,
    },
  },
  {
    createdAt: true,
    updatedAt: true,
    freezeTableName: true,
    timestamps: true,
    logging: false,
  }
);

// sequelize.sync({ alter: true });
module.exports = blobs;
